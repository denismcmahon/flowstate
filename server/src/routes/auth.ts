import { Router } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/User';
import { generateToken } from '../utils/generateToken';
import { requireAuth, AuthRequest } from '../middleware/requireAuth';
import { z } from 'zod';

const router = Router();

const registerSchema = z.object({
    name: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(8)
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
});

function setCookie(res: any, id: string, email: string) {
    const token = generateToken(id, email);
    res.cookie(process.env.COOKIE_NAME || 'fsid', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
}

router.post('/register', async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);
    if(!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const { email, password, name } = parsed.data;
    const existing = await User.findOne({ email });
    if(existing) return res.status(409).json({ error: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, name });

    setCookie(res, user.id, user.email);
    res.status(201).json({ id: user.id, email: user.email, name: user.name });
});

router.post('/login', async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if(!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

    const { email, password } = parsed.data;
    const user = await User.findOne({ email });
    if(!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if(!valid) return res.status(401).json({ error: 'Invalid credentials' });

    setCookie(res, user.id, user.email);
    res.json({ id: user.id, email: user.email, name: user.name });
});

router.post('/logout', (_req, res) => {
    res.clearCookie(process.env.COOKIE_NAME || 'fsid');
    res.json({ ok: true });
});

router.get('/me', requireAuth, async (req: AuthRequest, res) => {
    const user = await User.findById(req.user!.id).select('id email name');
    res.json(user);
});

export default router;