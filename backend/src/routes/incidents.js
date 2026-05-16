import { Router } from 'express';
import { query } from '../config/db.js';
import { adminMiddleware } from '../middleware/auth.js';
import { logSystem } from '../utils/logger.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    let sql = 'SELECT * FROM incidents';
    const params = [];
    if (status) {
      sql += ' WHERE status = $1';
      params.push(status);
    }
    sql += ' ORDER BY created_at DESC';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await query('SELECT * FROM incidents WHERE id = $1', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Incident introuvable' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', adminMiddleware, async (req, res) => {
  try {
    const { type, title, description, latitude, longitude, severity, road_segment_id } = req.body;
    if (!type || !title || latitude == null || longitude == null) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    const result = await query(
      `INSERT INTO incidents (type, title, description, latitude, longitude, severity, road_segment_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [type, title, description || '', latitude, longitude, severity || 'medium', road_segment_id || null]
    );

    await logSystem('info', 'incidents', `Nouvel incident: ${title}`, { id: result.rows[0].id });

    const io = req.app.get('io');
    io?.emit('incident:new', result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id', adminMiddleware, async (req, res) => {
  try {
    const { status, title, description, severity } = req.body;
    const fields = [];
    const values = [];
    let i = 1;

    if (status) { fields.push(`status = $${i++}`); values.push(status); }
    if (title) { fields.push(`title = $${i++}`); values.push(title); }
    if (description !== undefined) { fields.push(`description = $${i++}`); values.push(description); }
    if (severity) { fields.push(`severity = $${i++}`); values.push(severity); }
    if (status === 'resolved') { fields.push(`resolved_at = NOW()`); }

    if (fields.length === 0) return res.status(400).json({ error: 'Aucune modification' });

    values.push(req.params.id);
    const result = await query(
      `UPDATE incidents SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    );

    if (!result.rows[0]) return res.status(404).json({ error: 'Incident introuvable' });

    req.app.get('io')?.emit('incident:updated', result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    const result = await query('DELETE FROM incidents WHERE id = $1 RETURNING *', [req.params.id]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Incident introuvable' });
    req.app.get('io')?.emit('incident:deleted', { id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
