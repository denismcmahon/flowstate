import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, index: true },
        name: { type: String, required: true },
        category: { type: String, default: 'General' },
        completedDates: { type: [String], default: [] },
        weeklyTarget: { type: Number, min: 0, max: 7, default: 7 }
    },
    { timestamps: true }
);

export default mongoose.model('Habit', habitSchema);