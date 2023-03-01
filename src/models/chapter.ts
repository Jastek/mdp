import mongoose from 'mongoose';

interface IChapter extends mongoose.Document{
    name: string;
    responsabilities: string;
    code: string;
}

const chapterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    responsabilities: {
        type: String,
        required: false
    },
    code: {
        type: String,
        required: false
    }
});

const Chapter = mongoose.model<IChapter>('chapter', chapterSchema)

export { Chapter, IChapter }