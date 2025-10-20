import { useEffect, useState } from 'react';
import { Box, Button, Typography,  CircularProgress } from '@mui/material';
import { startPomodoro, endPomodoro, Pomodoro } from '../api/pomodoro';
import dayjs from 'dayjs';

const WORK_DURATION = 50;
const BREAK_DURATION = 10;

type Props = {
    taskId: string;
    onComplete?: () => void;
};

export default function PomodoroTimer({ taskId, onComplete }: Props) {
    const [session, setSession] = useState<Pomodoro | null>(null);
    const [timeLeft, setTimeLeft] = useState(WORK_DURATION * 60);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        let timer: any;
        if(running && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(timeLeft => timeLeft - 1), 1000);
        }
        if (timeLeft === 0 && running && session) handleEnd();
        return () => clearInterval(timer);
    }, [running, timeLeft]);

    const handleStart = async () => {
        const newSession = await startPomodoro(taskId);
        setSession(newSession);
        setRunning(true);
        setTimeLeft(WORK_DURATION * 60);
    };

    const handleEnd = async () => {
        if (!session) return;
        await endPomodoro(session._id);
        setRunning(false);
        setTimeLeft(WORK_DURATION * 60);
    }
}