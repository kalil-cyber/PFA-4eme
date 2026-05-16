import jwt from 'jsonwebtoken';

const jwtSecret = () => process.env.JWT_SECRET || 'tariki-dev-secret';

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  try {
    const token = header.slice(7);
    req.user = jwt.verify(token, jwtSecret());
    if (!req.user?.role || !['admin', 'user'].includes(req.user.role)) {
      return res.status(401).json({ error: 'Token invalide' });
    }
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalide' });
  }
}

export function adminMiddleware(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }
    next();
  });
}

export function isAccessCodeRequired() {
  return Boolean(process.env.ADMIN_ACCESS_CODE?.trim());
}

export function verifyAdminAccessCode(accessCode) {
  const requiredCode = process.env.ADMIN_ACCESS_CODE?.trim();
  if (!requiredCode) return true;
  return accessCode === requiredCode;
}
