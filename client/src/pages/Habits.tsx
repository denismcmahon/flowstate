import DashboardLayout from '../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Checkbox, Paper, Grid, Card } from '@mui/material';
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

      <Grid
        container
        spacing={3}
        sx={{
          width: '100%',
          maxWidth: 'none',
          mt: 2,
          pr: 2
        }}
      >
        {habits.length > 0 ? (
          habits.map((habit) => {
            const done = habit.completedDates.includes(today);
            const week = getCurrentWeek();
            const completedDays = week.filter((d) => habit.completedDates.includes(d)).length;
            const completionRate = Math.round((completedDays / 7) * 100);

            return (
              <Grid item xs={12} sm={6} md={6} lg={6} xl={6} key={habit._id}>
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    bgcolor: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    height: 220,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                    transition: 'all 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      mb: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Checkbox checked={done} onClick={() => toggleHabitDone(habit._id)} />
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {habit.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {habit.category || 'General'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        minWidth: 60
                      }}
                    >
                      <Typography variant="body1" fontWeight={600}>
                        {completionRate}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        week
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(7, 1fr)',
                      gap: 1,
                      width: '100%',
                      alignSelf: 'center'
                    }}
                  >
                    {getCurrentWeek().map((date) => {
                      const dayLabel = dayjs(date).format('dd');
                      const isToday = date === today;
                      const bgColor = getDayColor(date, habit.completedDates);

                      return (
                        <Box
                          key={date}
                          sx={{
                            height: 38,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#fff',
                            backgroundColor: bgColor,
                            border: isToday ? '2px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                            transition: 'transform 0.15s ease',
                            '&:hover': { transform: 'scale(1.07)' }
                          }}
                          title={dayjs(date).format('dddd')}
                        >
                          {dayLabel}
                        </Box>
                      );
                    })}
                  </Box>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Typography color="text.secondary" sx={{ pl: 1 }}>
            No habits yet. Add your first one above!
          </Typography>
        )}
      </Grid>
    </DashboardLayout>
  );
}
