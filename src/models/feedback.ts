import mongoose from 'mongoose';
import { Comment, IComment, commentSchema } from './comment';
import { IPerson } from './person';
import { ISession } from './session';

interface IFeedback extends mongoose.Document{
    from: IPerson['_id'];
    to: IPerson['_id'];
    title: string;
    description: string;
    type: 'criticism' | 'praise';
    date: Date;
    comments: [IComment];
}

const feedbackSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'person',
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'person',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: new Date()
    },
    comments: [commentSchema]
});

const Feedback = mongoose.model<IFeedback>('feedback', feedbackSchema)

export { Feedback, IFeedback }