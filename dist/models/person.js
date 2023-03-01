"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignedResource = exports.Person = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const assignedResourceSchema = new mongoose_1.default.Schema({
    resource: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
const personSchema = new mongoose_1.default.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "team"
    },
    position: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "position"
    },
    chapter: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "chapter"
    },
    reportsTo: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'person'
    },
    assignedResources: [assignedResourceSchema]
});
personSchema.post('save', (error, doc, next) => {
    if (error.name === 'MongoServerError' && error.code === 11000) {
        next("DuplicateKey");
    }
    else {
        next();
    }
});
const Person = mongoose_1.default.model('person', personSchema);
exports.Person = Person;
const AssignedResource = mongoose_1.default.model('assignedResource', assignedResourceSchema);
exports.AssignedResource = AssignedResource;
//# sourceMappingURL=person.js.map