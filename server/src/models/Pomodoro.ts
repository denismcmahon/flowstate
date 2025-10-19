import mongoose from 'mongoose';

const pomodoroSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    taskId: { type: String, required: true },
    startedAt: { type: Date, required: true },
    endedAt: { type: Date },
    duration: { type: Number },
    completed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Pomodoro', pomodoroSchema);