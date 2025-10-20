import { useEffect, useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { startPomodoro, endPomodoro } from '../api/pomodoro';
import type { Pomodoro } from '../api/pomodoro';
//import dayjs from 'dayjs';

const WORK_DURATION = 50;
//const BREAK_DURATION = 10;

type Props = {
  taskId: string;
  onComplete?: () => void;
};

export default function PomodoroTimer({ taskId, onComplete }: Props) {
  const [session, setSession] = useState<Pomodoro | null>(null);
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION * 60);
  const [running, setRunning] = useState(false);

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
    setSession(null);
    onComplete?.();
  };

  useEffect(() => {
    let timer: any;
    if (running && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((timeLeft) => timeLeft - 1), 1000);
    }
    if (timeLeft === 0 && running && session) handleEnd();
    return () => clearInterval(timer);
  }, [running, timeLeft, session]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <Box sx={{ textAlign: 'center', p: 2 }}>
      {!running ? (
        <Button variant="contained" onClick={handleStart}>
          Start Focus Session
        </Button>
      ) : (
        <>
          <Box sx={{ position: 'relative', display: 'inline-flex', mt: 2 }}>
            <CircularProgress
              variant="determinate"
              value={(timeLeft / (WORK_DURATION * 60)) * 100}
              size={160}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h5">
                {mins}:{secs.toString().padStart(2, '0')}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button variant="outlined" color="error" onClick={handleEnd}>
              End Session
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
