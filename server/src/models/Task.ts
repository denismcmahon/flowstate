import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    notes: { type: String },
    isFocus: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    date: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);