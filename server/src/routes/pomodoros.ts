import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import Pomodoro from '../models/Pomodoro';
import { z } from 'zod';

const router = Router();
router.use(requireAuth);

const startSchema = z.object({
    taskId: z.string()
});

router.post('/start', async (req: AuthRequest, res) => {
    const parsed = startSchema.safeParse(req.body);
    if(!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const { taskId } = parsed.data;
    const session = await Pomodoro.create({
        userId: req.user!.id,
        taskId, 
        startedAt: new Date()
    });
    res.status(201).json(session);
});

router.post('/end/:id', async (req: AuthRequest, res) => {
    const session = await Pomodoro.findOne({ _id: req.params.id, userId: req.user!.id });
    if(!session) return res.status(404).json({ error: 'Session not found' });

    const endedAt = new Date();
    const duration = Math.round((endedAt.getTime() - session.startedAt.getTime()) / 60000);

    session.endedAt = endedAt;
    session.duration = duration;
    session.completed = true;
    await session.save();

    res.json(session);
});

router.get('/', async (req: AuthRequest, res) => {
    const sessions = await Pomodoro.find({ userId: req.user!.id }).sort({ createdAt: -1 });
    res.json(sessions);
});

export default router;