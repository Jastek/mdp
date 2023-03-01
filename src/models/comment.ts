import mongoose from 'mongoose';
import { IPerson } from './person';

interface IComment extends mongoose.Document{
    from: IPerson["_id"];
    text: string;
    date: Date;
}

const commentSchema = new mongoose.Schema({
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'person',
        required: true
    },
    text: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    }
});

// commentSchema.add({
//     comments: [commentSchema]
// })

const Comment = mongoose.model<IComment>('comment', commentSchema)

export { Comment, IComment, commentSchema }