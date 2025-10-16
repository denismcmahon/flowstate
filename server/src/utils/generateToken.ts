import jwt from 'jsonwebtoken';

export const generateToken = (id: string, email: string) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRET!, { expiresIn: '7d' });
};