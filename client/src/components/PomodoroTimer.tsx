import { useState } from 'react';
import { Button } from '@mui/material';
import PomodoroPanel from './PomodoroPanel';

type Props = {
    taskId: string;
    onComplete?: () => void;
    taskTitle?: string;
    taskNotes?: string;
    disableAll?: boolean;
};

export default function PomodoroTimer({ taskId, onComplete, taskTitle, taskNotes, disableAll }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                variant="contained"
                onClick={() => setOpen(true)}
                disabled={disableAll}
            >
                Start Focus Session
            </Button>

            {open && (
                <PomodoroPanel 
                    task={{ _id: taskId, title: taskTitle || "Untitled Task", notes: taskNotes }}
                    onClose={() => setOpen(false)}
                    onComplete={onComplete}
                />
            )}
        </>
    );
}