import DashboardLayout from '../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  Paper,
  Grid,
  Card,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  getHabits,
  createHabit,
  toggleHabit,
  updateHabit,
  deleteHabit as deleteHabitApi,
  toggleHabitDate
} from '../api/habits';
import type { Habit } from '../api/habits';
import dayjs from 'dayjs';

type HabitUI = Habit & { isEditing?: boolean; editName?: string };

export default function Habits() {
  const [habits, setHabits] = useState<HabitUI[]>([]);
  const [habitName, setHabitName] = useState('');

  const loadHabits = async () => {
    const data = await getHabits();
    setHabits(data.map((habit) => ({ ...habit })));
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
      prev.map((habit) =>
        habit._id === id
          ? {
              ...habit,
              completedDates: habit.completedDates.includes(today)
                ? habit.completedDates.filter((d) => d !== today)
                : [...habit.completedDates, today]
            }
          : habit
      )
    );

    toggleHabit(id).catch(() => loadHabits());
  };

  const beginEdit = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) => (habit._id === id ? { ...habit, isEditing: true, editName: habit.name } : habit))
    );
  };

  const changeEditName = (id: string, name: string) => {
    setHabits((prev) =>
      prev.map((habit) => (habit._id === id ? { ...habit, editName: name } : habit))
    );
  };

  const commitEdit = async (id: string) => {
    const target = habits.find((habit) => habit._id === id);
    if (!target) return;
    const newName = (target.editName ?? target.name).trim();
    if (!newName) return;
    setHabits((prev) =>
      prev.map((habit) =>
        habit._id === id
          ? { ...habit, name: newName, isEditing: false, editName: undefined }
          : habit
      )
    );
    try {
      await updateHabit(id, { name: newName });
    } catch {
      loadHabits();
    }
  };

  const deleteHabit = async (id: string) => {
    const prev = habits;
    setHabits(habits.filter((habit) => habit._id !== id));
    try {
      await deleteHabitApi(id);
    } catch {
      setHabits(prev);
    }
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

      <Grid container spacing={3} sx={{ width: '100%', maxWidth: 'none', mt: 2, pr: 2 }}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
                      <Checkbox checked={done} onClick={() => toggleHabitDone(habit._id)} />
                      {habit.isEditing ? (
                        <TextField
                          size="small"
                          value={habit.editName || ''}
                          onChange={(e) => changeEditName(habit._id, e.target.value)}
                          onBlur={() => commitEdit(habit._id)}
                          onKeyDown={(e) => e.key === 'Enter' && commitEdit(habit._id)}
                          autoFocus
                        />
                      ) : (
                        <Typography
                          variant="h6"
                          fontWeight={600}
                          sx={{ cursor: 'pointer' }}
                          onClick={() => beginEdit(habit._id)}
                        >
                          {habit.name}
                        </Typography>
                      )}
                      <IconButton
                        onClick={() => deleteHabit(habit._id)}
                        size="small"
                        color="error"
                        sx={{ ml: 'auto' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
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
                            border: isToday
                              ? '2px solid #fff'
                              : '1px solid rgba(255,255,255,0.2)',
                            transition: 'transform 0.15s ease',
                            cursor: 'pointer',
                            '&:hover': { transform: 'scale(1.07)' }
                          }}
                          onClick={async () => {
                            setHabits((prev) =>
                              prev.map((habit) =>
                                habit._id === habit._id
                                  ? {
                                      ...habit,
                                      completedDates: habit.completedDates.includes(date)
                                        ? habit.completedDates.filter((d) => d !== date)
                                        : [...habit.completedDates, date]
                                    }
                                  : habit
                              )
                            );
                            try {
                              await toggleHabitDate(habit._id, date);
                            } catch {
                              loadHabits();
                            }
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
