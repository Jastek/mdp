"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HardHability = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const teamPonderationSchema = new mongoose_1.default.Schema({
    ponderation: {
        type: Number,
        required: false
    },
    team: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "team"
    },
});
const chapterPonderationSchema = new mongoose_1.default.Schema({
    ponderation: {
        type: Number,
        required: false
    },
    chapter: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "chapter"
    },
});
const positionPonderationSchema = new mongoose_1.default.Schema({
    ponderation: {
        type: Number,
        required: false
    },
    position: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "position"
    },
});
const hardHabilitySchema = new mongoose_1.default.Schema({
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
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "resource"
    },
    teamPonds: [teamPonderationSchema],
    chapterPonds: [chapterPonderationSchema],
    positionPonds: [positionPonderationSchema]
});
const HardHability = mongoose_1.default.model('hardHability', hardHabilitySchema);
exports.HardHability = HardHability;
//# sourceMappingURL=hard-habilities.js.map