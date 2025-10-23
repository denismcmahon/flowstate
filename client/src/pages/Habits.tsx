import DashboardLayout from '../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, Checkbox, Paper } from '@mui/material';
import { getHabits, createHabit, toggleHabit } from '../api/habits';
import type { Habit } from '../api/habits';
import dayjs from 'dayjs';

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
    if (completionRate < 33) return 'rgba(220, 53, 69, 0.2)';
    if (completionRate < 66) return 'rgba(255, 193, 7, 0.25)';
    return 'rgba(40, 167, 69, 0.25)';
  };

  const getCurrentWeek = () => {
    const startOfWeek = dayjs().startOf('week').add(1, 'day');
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(startOfWeek.add(i, 'day').format('YYYY-MM-DD'));
    }
    return days;
  };

  const getDayColor = (date: string, completedDates: string[]) => {
    const today = dayjs().format('YYYY-MM-DD');
    const isDone = completedDates.includes(date);
    const isFuture = dayjs(date).isAfter(today, 'day');

    if (isDone) return '#28a745';
    if (isFuture) return 'rgba(128, 128, 128, 0.4)';
    return 'rgba(255, 99, 71, 0.8)';
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
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 2,
                  mb: 2,
                  p: 2,
                  background: 'rgba(255,255,255,0.02)'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Checkbox checked={done} onClick={() => toggleHabitDone(habit._id)} />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography fontWeight={600}>{habit.name}</Typography>
                    {habit.category && (
                      <Typography variant="body2" color="text.secondary">
                        {habit.category}
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: 0.8,
                    mt: 2,
                    width: '100%',
                    maxWidth: 260
                  }}
                >
                  {getCurrentWeek().map((date) => {
                    const isDone = habit.completedDates.includes(date);
                    const dayLabel = dayjs(date).format('dd');
                    const isToday = date === today;

                    return (
                      <Box
                        key={date}
                        sx={{
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 1,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          color: '#fff',
                          backgroundColor: getDayColor(date, habit.completedDates),
                          border: isToday ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                          transition: 'transform 0.15s ease',
                          '&:hover': { transform: 'scale(1.06)' }
                        }}
                        title={dayjs(date).format('dddd')}
                      >
                        {dayLabel}
                      </Box>
                    );
                  })}
                </Box>
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
