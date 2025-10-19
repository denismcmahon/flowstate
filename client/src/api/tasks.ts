import { api } from './axios';

export type Task = {
    _id: string;
    title: string;
    notes?: string;
    isFocus: boolean;
    completed: boolean;
    date: string;
    createdAt: string;
    updatedAt: string;
};

export const getTasks = (date?: string) => api.get<Task[]>('/tasks', { params: { date }}).then(response => response.data);
export const createTask = (payload: Partial<Task>) => api.post<Task>('/tasks', payload).then(response => response.data);
export const updateTask = (id: string, payload: Partial<Task>) => api.patch<Task>(`/tasks/${id}`, payload).then(response => response.data);
export const deleteTask = (id: string) => api.delete(`/tasks/${id}`).then(response => response.data);