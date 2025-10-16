import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { connectDB } from './config/db';
import authRouter from './routes/auth';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

const PORT = Number(process.env.PORT) || 4000;

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () =>
    console.log(`Server running at http://localhost:${PORT}`)
  );
});