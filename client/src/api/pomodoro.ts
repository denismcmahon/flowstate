import { api } from './axios';

export type Pomodoro = { 
    _id: string;
    taskId: string;
    startedAt: string;
    endedAt?: string;
    duration?: number;
    completed: boolean;
};

export const startPomodoro = (taskId: string) => 
    api.post<Pomodoro>('/pomodoros/start', { taskId }).then(response => response.data)