import mongoose from 'mongoose';
import { IResource } from './resource';
import { ITeam} from './team';
import { IChapter } from './chapter';
import { IPosition} from './position';

interface IHardHability extends mongoose.Document{
    name: string;
    code: string;
    detail: string;
    category: string;
    resources: [IResource['_id']];
    teamPonds:[ITeamPonderation];
    chapterPonds: [IChapterPonderation];
    positionPonds: [IPositionPonderation];
}

interface ITeamPonderation extends mongoose.Document {
    ponderation: number;
    team: ITeam["_id"]
}

interface IChapterPonderation extends mongoose.Document {
    ponderation: number;
    chapter: IChapter["_id"]
}

interface IPositionPonderation extends mongoose.Document {
    ponderation: number;
    position: IPosition["_id"]
}

const teamPonderationSchema = new mongoose.Schema({
    ponderation: {
        type: Number,
        required: false
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
         ref: "team"
    },
});

const chapterPonderationSchema = new mongoose.Schema({
    ponderation: {
        type: Number,
        required: false
    },
    chapter: {
        type: mongoose.Schema.Types.ObjectId,
         ref: "chapter"
    },
});

const positionPonderationSchema = new mongoose.Schema({
    ponderation: {
        type: Number,
        required: false
    },
    position: {
        type: mongoose.Schema.Types.ObjectId,
         ref: "position"
    },
});

const hardHabilitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: false
    },
    detail: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    resources: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "resource"
    },
    teamPonds: [teamPonderationSchema],
    chapterPonds: [chapterPonderationSchema],
    positionPonds: [positionPonderationSchema]

});

const HardHability = mongoose.model<IHardHability>('hardHability', hardHabilitySchema)

export { HardHability, IHardHability }