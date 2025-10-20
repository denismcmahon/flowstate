import DashboardLayout from '../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../api/tasks';
import type { Task } from '../api/tasks';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  Checkbox,
  IconButton,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/StarBorder';
import StarFilledIcon from '@mui/icons-material/Star';
import PomodoroTimer from '../components/PomodoroTimer';

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const loadTasks = async () => {
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
      setTasks([]);
    }
  };
  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    await createTask({ title });
    setTitle('');
    loadTasks();
  };

  const toggleCompleted = async (task: Task) => {
    await updateTask(task._id, { completed: !task.completed });
    loadTasks();
  };

  const toggleFocus = async (task: Task) => {
    await updateTask(task._id, { isFocus: !task.isFocus });
    loadTasks();
  };

  const removeTask = async (id: string) => {
    await deleteTask(id);
    loadTasks();
  };

  const focusCount = tasks.filter((task) => task.isFocus).length;

  return (
    <DashboardLayout>
      <Typography variant="h4" fontWeight={600}>
        Today
      </Typography>
      <Typography sx={{ mt: 1, mb: 3 }} color="text.secondary">
        Choose up to 3 focus tasks. Keep it tight, keep it doable.
      </Typography>

      <Box sx={{ display: 'flex', gap: 1, mb: 2, maxWidth: 560 }}>
        <TextField
          fullWidth
          placeholder="Add a task..."
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && addTask()}
        />
        <Button variant="contained" onClick={addTask} sx={{ minWidth: 120, px: 3 }}>
          Add Task
        </Button>
      </Box>

      <Chip
        label={`Focus: ${focusCount}/3`}
        color={focusCount > 3 ? 'error' : 'primary'}
        sx={{ mb: 2 }}
      />

      <List sx={{ maxWidth: 720 }}>
        {tasks.map((task) => (
          <ListItem
            key={task._id}
            secondaryAction={
              <Box>
                <IconButton onClick={() => toggleFocus(task)} title="Mark as focus">
                  {task.isFocus ? <StarFilledIcon /> : <StarIcon />}
                </IconButton>

                <IconButton onClick={() => removeTask(task._id)} title="Delete task">
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <Checkbox checked={task.completed} onChange={() => toggleCompleted(task)} />
            <Typography sx={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.title}
            </Typography>
            {task.isFocus && !task.completed && (
              <Box sx={{ ml: 5, mt: 1 }}>
                <PomodoroTimer
                  taskId={task._id}
                  taskTitle={task.title}
                  taskNotes={task.notes}
                  onComplete={loadTasks}
                  disableAll={!!activeTask && activeTask._id !== task._id}
                />
              </Box>
            )}
          </ListItem>
        ))}
      </List>
    </DashboardLayout>
  );
}
