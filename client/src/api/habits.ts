import { api } from './axios';

export type Habit = {
    _id: string;
    name: string;
    category?: string;
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

export const updateHabit = (id: string, data: Partial<{ name: string; category: string }>) => 
    api.put<Habit>(`/habits/${id}`, data).then((response) => response.data);

export const deleteHabit = (id: string) => 
    api.delete<{ success: boolean }>(`/habits/${id}`).then((response) => response.data);
