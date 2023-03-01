import { NextFunction } from 'express';
import mongoose from 'mongoose';
import { IPosition, Position } from './position';
import { IResource, Resource } from './resource';

interface IPerson extends mongoose.Document {
    email: string;
    username: string;
    firstName: string;
    lastName1: string;
    lastName2: string;
    team: string;
    level: number;
    chapter: string;
    position: IPosition["_id"];
    isAdmin: boolean;
    assignedResources: [IAssignedResource];
}

interface IAssignedResource extends mongoose.Document {
    resource: IResource['_id'];
    date: Date;
    startDate?: Date;
    finishDate?: Date;
    calification?: number;
    progress: number;
    status: 'assigned' | 'progress' | 'finished';
    plan?: number;
}

const assignedResourceSchema = new mongoose.Schema({
    resource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "resource",
        required: true,
        unique: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    startDate: {
        type: Date,
        required: false
    },
    finishDate: {
        type: Date,
        required: false,
    },
    calification: {
        type: Number,
        required: false,
    },
    progress: {
        type: Number,
        required: true,
        default: 0,
    },
    status: {
        type: String,
        required: true,
        default: 'assigned'
    },
    plan: {
        type: Number,
        required: false
    }
});

const personSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        immutable: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        immutable: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName1: {
        type: String,
        required: true
    },
    lastName2: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true,
        default: 0
    },
    isAdmin: {
        type: Boolean,
        required: false
    },
    isTeamLeader: {
        type: Boolean,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "team"
    },
    position: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "position"
    },
    chapter: {
        type: mongoose.Schema.Types.ObjectId,
         ref: "chapter"
    },
    reportsTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'person'
    },
    assignedResources: [assignedResourceSchema]

});

personSchema.post('save', (error: any, doc: any, next: NextFunction) => {

    if (error.name === 'MongoServerError' && error.code === 11000) {
        next("DuplicateKey")
    } else{
        next();
    }
})

const Person = mongoose.model<IPerson>('person', personSchema);
const AssignedResource = mongoose.model<IAssignedResource>('assignedResource', assignedResourceSchema);

export { Person, IPerson, AssignedResource, IAssignedResource }