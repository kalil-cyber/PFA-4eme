import { Router } from 'express';
import { chatReply } from '../services/chatAssistant.js';
import { logSystem } from '../utils/logger.js';

const router = Router();

router.get('/status', (req, res) => {
  res.json({
    enabled: true,
    mode: process.env.OPENAI_API_KEY ? 'openai' : 'smart',
    intelligence: 'v2',
    draggable: true,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    city: 'Casablanca',
  });
});

router.post('/message', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message requis' });
    }

    const result = await chatReply(message, history || []);
    await logSystem('info', 'chatbot', `Question: ${message.slice(0, 80)}`);

    res.json({
      reply: result.reply,
      mode: result.mode,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    await logSystem('error', 'chatbot', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
