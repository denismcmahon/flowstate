import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import Task from '../models/Task';
import { z } from 'zod';
import dayjs from 'dayjs';

const router = Router();
router.use(requireAuth);

const createSchema = z.object({
    title: z.string().min(1),
    notes: z.string().optional(),
    isFocus: z.boolean().optional(),
    date: z.string().optional()
});

router.get('/', async (req: AuthRequest, res) => {
    const currentDate = (req.query.date as string) || dayjs().format('YYYY-MM-DD');
    const tasks = await Task.find({ userId: req.user!.id, date: currentDate }).sort({ createdAt: 1 });
    res.json(tasks);
});

router.post('/', async (req: AuthRequest, res) => {
    const parsed = createSchema.safeParse(req.body);
    if(!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const date = parsed.data.date || dayjs().format('YYYY-MM-DD');
    const task = await Task.create({ ...parsed.data, date, userId: req.user!.id });
    res.status(201).json(task);
});

router.patch('/:id', async (req: AuthRequest, res) => {
    const updates = (({ title, notes, isFocus, completed }) => ({ title, notes, isFocus, completed}))(req.body);
    const task = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.user!.id },
        { $set: updates },
        { new: true }
    );
    if(!task) return res.status(404).json({ error: 'Not found' });
    res.json(task);
});

router.delete('/:id', async (req: AuthRequest, res) => {
    const ok = await Task.deleteOne({ _id: req.params.id, userId: req.user!.id });
    if(!ok.deletedCount) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
});

export default router;