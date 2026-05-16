import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/db.js';
import { logSystem } from '../utils/logger.js';
import { useMemory, store } from '../data/memoryStore.js';
import {
  authMiddleware,
  isAccessCodeRequired,
  verifyAdminAccessCode,
} from '../middleware/auth.js';

const router = Router();
const jwtSecret = () => process.env.JWT_SECRET || 'tariki-dev-secret';

function signUserToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    jwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

async function findUserByEmail(email) {
  const result = await query(
    'SELECT id, email, password_hash, name, role FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
}

async function findLegacyAdminByEmail(email) {
  const result = await query('SELECT * FROM admins WHERE email = $1', [email]);
  return result.rows[0] || null;
}

async function resolveAccount(email) {
  const user = await findUserByEmail(email);
  if (user) return { ...user, role: user.role || 'user' };

  const admin = await findLegacyAdminByEmail(email);
  if (admin) {
    return {
      id: admin.id,
      email: admin.email,
      password_hash: admin.password_hash,
      name: admin.name,
      role: 'admin',
    };
  }
  return null;
}

router.get('/portal-config', (req, res) => {
  res.json({
    accessCodeRequired: isAccessCodeRequired(),
    roles: ['user', 'admin'],
  });
});

/** Vérifie si un email est enregistré (notification connexion côté client) */
router.get('/check-email', async (req, res) => {
  try {
    const email = String(req.query.email || '')
      .trim()
      .toLowerCase();
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    const account = await resolveAccount(email);
    if (!account) {
      return res.json({ exists: false, email });
    }

    res.json({
      exists: true,
      email: account.email,
      name: account.name,
      role: account.role,
      roleLabel: account.role === 'admin' ? 'Administrateur' : 'Conducteur',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authMiddleware, (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
    },
  });
});

router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role = 'user', accessCode } = req.body;
    const normalizedRole = role === 'admin' ? 'admin' : 'user';

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Nom, email et mot de passe requis' });
    }
    if (password.length < 4) {
      return res.status(400).json({ error: 'Mot de passe : 4 caractères minimum' });
    }

    if (normalizedRole === 'admin' && !verifyAdminAccessCode(accessCode)) {
      await logSystem('warn', 'auth', `Inscription admin refusée (code): ${email}`);
      return res.status(401).json({ error: 'Code d\'accès administrateur invalide' });
    }

    const existing = await findUserByEmail(email.trim().toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'Un compte existe déjà avec cet email' });
    }

    const legacy = await findLegacyAdminByEmail(email.trim().toLowerCase());
    if (legacy) {
      return res.status(409).json({ error: 'Un compte existe déjà avec cet email' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const id = uuidv4();
    const emailNorm = email.trim().toLowerCase();

    if (useMemory()) {
      store.users.push({
        id,
        email: emailNorm,
        password_hash,
        name: name.trim(),
        role: normalizedRole,
        created_at: new Date().toISOString(),
      });
    } else {
      await query(
        `INSERT INTO users (id, email, password_hash, name, role)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, emailNorm, password_hash, name.trim(), normalizedRole]
      );
    }

    const user = { id, email: emailNorm, name: name.trim(), role: normalizedRole };
    const token = signUserToken(user);
    await logSystem('info', 'auth', `Inscription ${normalizedRole}: ${emailNorm}`);

    res.status(201).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, accessCode } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    const account = await resolveAccount(email.trim().toLowerCase());
    if (!account || !(await bcrypt.compare(password, account.password_hash))) {
      await logSystem('warn', 'auth', `Tentative de connexion échouée: ${email}`);
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    if (account.role === 'admin' && !verifyAdminAccessCode(accessCode)) {
      await logSystem('warn', 'auth', `Code d'accès invalide pour admin: ${email}`);
      return res.status(401).json({ error: 'Code d\'accès administrateur invalide' });
    }

    const token = signUserToken(account);
    await logSystem('info', 'auth', `Connexion ${account.role}: ${account.email}`);

    res.json({
      token,
      user: {
        id: account.id,
        email: account.email,
        name: account.name,
        role: account.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
