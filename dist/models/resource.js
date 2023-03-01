"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const durationSchema = new mongoose_1.default.Schema({
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
});
const resourceSchema = new mongoose_1.default.Schema({
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
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "person",
        required: false
    },
    hardHabilities: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "hardHability",
        required: false
    }
});
const Resource = mongoose_1.default.model('resource', resourceSchema);
exports.Resource = Resource;
//# sourceMappingURL=resource.js.map