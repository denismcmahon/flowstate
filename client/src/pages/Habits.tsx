import DashboardLayout from '../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, Checkbox, Paper } from '@mui/material';
import { getHabits, createHabit, toggleHabit } from '../api/habits';
import type { Habit } from '../api/habits';

export default function Habits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitName, setHabitName] = useState('');

  const loadHabits = async () => {
    const data = await getHabits();
    setHabits(data);
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const addHabit = async () => {
    if (!habitName.trim()) return;
    await createHabit(habitName);
    setHabitName('');
    loadHabits();
  };

  const toggleHabitDone = async (id: string) => {
    const today = new Date().toISOString().slice(0, 10);

    setHabits((prev) =>
      prev.map((h) =>
        h._id === id
          ? {
              ...h,
              completedDates: h.completedDates.includes(today)
                ? h.completedDates.filter((d) => d !== today)
                : [...h.completedDates, today]
            }
          : h
      )
    );

    toggleHabit(id).catch(() => {
      loadHabits();
    });
  };

  const today = new Date().toISOString().slice(0, 10);
  const completedCount = habits.filter((habit) => habit.completedDates.includes(today)).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits ? Math.round((completedCount / totalHabits) * 100) : 0;

  const getRateColor = () => {
    if (completionRate < 33) return 'rgba(220, 53, 69, 0.2)'; // red
    if (completionRate < 66) return 'rgba(255, 193, 7, 0.25)'; // orange/yellow
    return 'rgba(40, 167, 69, 0.25)'; // green
  };

  return (
    <DashboardLayout>
      <Typography variant="h4" fontWeight={600}>
        Habits
      </Typography>
      <Typography sx={{ mt: 1, mb: 3 }} color="text.secondary">
        Track your daily habits and build consistency.
      </Typography>

      <Box sx={{ maxWidth: 560 }}>
        <Paper
          elevation={4}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight={600}>
              Today's Summary
            </Typography>
            <Typography color="text.secondary">
              You've completed {completedCount} of {totalHabits} habits today.
            </Typography>
          </Box>

          <Box
            sx={{
              background: getRateColor(),
              px: 4,
              py: 2,
              borderRadius: 2,
              textAlign: 'center',
              minWidth: 140
            }}
          >
            <Typography variant="h4" fontWeight={700}>
              {completionRate}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Completion Rate
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Add a habit..."
            value={habitName}
            onChange={(event) => setHabitName(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && addHabit()}
          />
          <Button variant="contained" onClick={addHabit} sx={{ minWidth: 120, px: 3 }}>
            Add
          </Button>
        </Box>
      </Box>

      <Typography variant="body2" sx={{ mb: 2 }}>
        Completed today: {completedCount}/{habits.length}
      </Typography>

      <List sx={{ maxWidth: 720 }}>
        {habits.length > 0 ? (
          habits.map((habit) => {
            const done = habit.completedDates.includes(today);
            return (
              <ListItem
                key={habit._id}
                onClick={() => toggleHabitDone(habit._id)}
                sx={{
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 1,
                  mb: 1,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' }
                }}
              >
                <Checkbox checked={done} />
                <Typography
                  sx={{
                    textDecoration: done ? 'line-through' : 'none',
                    opacity: done ? 0.7 : 1,
                    fontWeight: 500
                  }}
                >
                  {habit.name}
                </Typography>
              </ListItem>
            );
          })
        ) : (
          <Typography color="text.secondary" sx={{ pl: 1 }}>
            No habits yet. Add your first one above!
          </Typography>
        )}
      </List>
    </DashboardLayout>
  );
}
