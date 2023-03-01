import mongoose from 'mongoose';
import { IPerson} from './person';
import { IHardHability } from './hard-habilities';

interface IResource extends mongoose.Document{
    name: string;
    detail: string;
    url: string;
    platform: string;
    price: number;
    duration: IDuration;
    level: number;
    expert: [IPerson['_id']];
    hardHabilities: [IHardHability['_id']]
}

interface IDuration extends mongoose.Document {
    days: number;
    hours: number;
    minutes: number;
}

const durationSchema = new mongoose.Schema({
    days: {
        type: Number,
        required: false,
        default: 0
    },
    hours: {
        type: Number,
        required: false,
        default: 0
    },
    minutes: {
        type: Number,
        required: false,
        default: 0
    },
})

const resourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    detail: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: false
    },
    duration: {
        type: durationSchema,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    experts: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "person",
        required: false
    },
    hardHabilities: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "hardHability",
        required: false
    }
});

const Resource = mongoose.model<IResource>('resource', resourceSchema)

export { Resource, IResource }