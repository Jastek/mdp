import mongoose from 'mongoose';
import { Person, IPerson } from './person';

interface IsessionItem extends mongoose.Document {
    title: string;
    content: string;
};

interface ISession extends mongoose.Document{
    date: Date;
    from: IPerson['_id'];
    to: IPerson['_id'];
    items: [IsessionItem]
};

const sessionItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const sessionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "person",
        required: true
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "person",
        required: true,
        immutable: true
    },
    items: [sessionItemSchema]
});

const Session = mongoose.model<ISession>('session', sessionSchema)

export { Session, ISession }