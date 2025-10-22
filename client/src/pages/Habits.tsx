import DashboardLayout from '../layouts/DashboardLayout';
import { useEffect, useState } from 'react';
import { 
    Box,
    Typography,
    TextField,
    Button,
    List,
    ListItem,
    Checkbox
} from '@mui/material';
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
        setHabitName("");
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
                    : [...h.completedDates, today],
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

    return (
        <DashboardLayout>
            <Typography variant="h4" fontWeight={600}>
                Habits
            </Typography>
            <Typography sx={{ mt: 1, mb: 3 }} color="text.secondary">
                Track your daily habits and build consistency.
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 2, maxWidth: 560 }}>
                <TextField 
                    fullWidth
                    placeholder="Add a habit..."
                    value={habitName}
                    onChange={(event) => setHabitName(event.target.value)}
                    onKeyDown={(event) => event.key === "Enter" && addHabit()}
                />
                <Button variant="contained" onClick={addHabit} sx={{ minWidth: 120, px: 3 }}>
                    Add
                </Button>
            </Box>

            <Typography variant="body2" sx={{ mb: 2 }}>
                Completed today: {completedCount}/{habits.length}
            </Typography>

            <List sx={{ maxWidth: 720 }}>
                {habits.length > 0 ? (
                    habits.map((habit) => {
                        const done = habit.completedDates.includes(today);
                        console.log('DM ==> done: ', done);
                        return (
                            <ListItem
                                key={habit._id}
                                onClick={() => toggleHabitDone(habit._id)}
                                sx={{
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: 1,
                                    mb: 1,
                                    "&:hover": { backgroundColor: "rgba(255,255,255,0.05" }
                                }}
                            >
                                <Checkbox checked={done} />
                                <Typography
                                    sx={{
                                        textDecoration: done ? "line-through" : "none",
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
    )
};