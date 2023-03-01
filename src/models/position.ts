import mongoose from 'mongoose';

interface IPosition extends mongoose.Document{
    name: string;
    responsabilities: string;
    code: string;
    order: number;
}

const positionSchema = new mongoose.Schema({
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
        required: true
    },
    order: {
        type: Number,
        required: true
    }
});

const Position = mongoose.model<IPosition>('position', positionSchema)

export { Position, IPosition }