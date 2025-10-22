import { api } from './axios';

export type Habit = {
    _id: string;
    name: string;
    completedDates: string[];
    createdAt: string;
    updatedAt: string;
};

export const getHabits = () => 
    api.get<Habit[]>('/habits').then((response) => response.data);

export const createHabit = (name: string) => 
    api.post<Habit>('/habits', { name }).then((response) => response.data);

export const toggleHabit = (id: string) => 
    api.patch<Habit>(`/habits/${id}/toggle`).then((response) => response.data);