import { Router } from 'express';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import Habit from '../models/Habit';
import dayjs from 'dayjs';

const router = Router();
router.use(requireAuth);

router.get('/', async (req: AuthRequest, res) => {
    const habits = await Habit.find({ userId: req.user!.id }).sort({ createdAt: -1 });
    res.json(habits);
});

router.post('/', async (req: AuthRequest, res) => {
    const { name } = req.body;
    if (!name || name.trim() === '') return res.status(400).json({ error: 'Name required' });

    const habit = await Habit.create({
        userId: req.user!.id,
        name: name.trim()
    });

    res.status(201).json(habit);
});

router.patch('/:id/toggle', async (req: AuthRequest, res) => {
    const today = dayjs().format('YYYY-MM-DD');
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user!.id });
    if(!habit) return res.status(404).json({ error: 'Habit not found' });

    const isCompleted = habit.completedDates.includes(today);
    if(isCompleted) {
        habit.completedDates = habit.completedDates.filter((day) => day !== today);
    } else {
        habit.completedDates.push(today);
    }

    await habit.save();
});

router.put(':/id', async (req: AuthRequest, res) => {
    try {
        const { name, category } = req.body;
        const updated = await Habit.findByIdAndUpdate(
            { _id: req.params.id, userId: req.user!.id },
            { ...(name && {name}), ...(category && { category }) },
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update habit' });
    }
});

router.delete('/:id', async (req: AuthRequest, res) => {
    try {
        await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete habit' });
    }
});

export default router;