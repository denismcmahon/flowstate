import { useEffect, useState } from 'react';
import { Drawer, Box, Typography, Button, CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { startPomodoro, endPomodoro } from '../api/pomodoro';
import type { Task } from '../api/tasks';

const WORK_DURATION = 50;

type Props = {
  task: Partial<Task> & { _id: string; title: string };
  onClose: () => void;
  onComplete?: () => void;
};

export default function PomodoroPanel({ task, onClose, onComplete }: Props) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION * 60);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    if (running && !paused && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((time) => time - 1), 1000);
    } else if (timeLeft === 0 && running) {
      handleEnd();
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [running, paused, timeLeft]);

  const handleStart = async () => {
    const session = await startPomodoro(task._id);
    setSessionId(session._id);
    setRunning(true);
  };

  const handlePause = () => setPaused(true);
  const handleResume = () => setPaused(false);

  const handleEnd = async () => {
    if (sessionId) await endPomodoro(sessionId);
    setRunning(false);
    setPaused(false);
    setSessionId(null);
    setTimeLeft(WORK_DURATION * 60);
    onComplete?.();
    onClose();
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <Drawer
      anchor="right"
      open
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 600 },
          p: 3,
          bgcolor: '#f9fafc',
          boxShadow: '-4px 0 12px rgba(0,0,0,0.1)'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={600}>
          Focus Session
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Task
        </Typography>
        <Typography variant="h5" fontWeight={600}>
          {task.title}
        </Typography>
        {task.notes && (
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
            {task.notes}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: 'grid', placeItems: 'center', mt: 5 }}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={(timeLeft / (WORK_DURATION * 60)) * 100}
            size={350}
            thickness={3}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography variant="h2" fontWeight={700}>
              {mins}:{secs.toString().padStart(2, '0')}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        {!running && (
          <Button variant="contained" onClick={handleStart}>
            Start
          </Button>
        )}
        {running && !paused && (
          <Button variant="outlined" onClick={handlePause} startIcon={<PauseIcon />}>
            Pause
          </Button>
        )}
        {running && paused && (
          <Button variant="contained" onClick={handleResume} startIcon={<PlayArrowIcon />}>
            Resume
          </Button>
        )}
        {running && (
          <Button variant="outlined" color="error" onClick={handleEnd}>
            End
          </Button>
        )}
      </Box>
    </Drawer>
  );
}
