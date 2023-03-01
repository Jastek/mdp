import mongoose from 'mongoose';
import { IHardHability } from './hard-habilities';
import { IPerson } from './person';

/**
 * Hard evaluation interface
 */
interface IHardEvaluation extends mongoose.Document{
    person: IPerson["_id"];
    date: Date;
    finishDate: Date;
    califications: [IHardEvalElement]
}

/**
 * Hard evaluation element interface
 */
interface IHardEvalElement extends mongoose.Document {
    calification: number;
    hardHability: IHardHability["_id"];
    hardHabilityName: string;
    hardCategoryName: string;
}

/**
 * Hard evaluation element schema
 */
const hardEvalElementSchema = new mongoose.Schema({
    calification: {
        type: Number,
        required: false,
    },
    hardHability: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "hardHability"
    },
    hardHabilityName: {
        type: String,
        required: true
    },
    hardCategoryName: {
        type: String,
        required: true
    }
})

/**
 * Hard evaluation element
 */
const hardEvaluationSchema = new mongoose.Schema({
    person: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "person",
        immutable: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    finishDate: {
        type: Date,
        required: false
    },
    califications: [hardEvalElementSchema],


});

const HardEvaluation = mongoose.model<IHardEvaluation>('hardEvaluation', hardEvaluationSchema)

export { HardEvaluation, IHardEvaluation }