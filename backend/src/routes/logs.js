import { Router } from 'express';
import { query } from '../config/db.js';
import { adminMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/', adminMiddleware, async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit || '50', 10), 200);
    const level = req.query.level;

    let sql = 'SELECT * FROM system_logs';
    const params = [];
    if (level) {
      sql += ' WHERE level = $1';
      params.push(level);
    }
    sql += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
