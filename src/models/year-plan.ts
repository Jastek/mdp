import mongoose from 'mongoose';

interface IYearPlan extends mongoose.Document{
    year: number;
    detail: string;
}

const yearPlanSchema = new mongoose.Schema({
    year: {
        type: Number,
        required: true
    },
    detail: {
        type: String,
        required: true
    }
});

const YearPlan = mongoose.model<IYearPlan>('yearPlan', yearPlanSchema)

export { YearPlan, IYearPlan }