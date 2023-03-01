"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Feedback = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const comment_1 = require("./comment");
const feedbackSchema = new mongoose_1.default.Schema({
    from: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'person',
        required: true
    },
    to: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'person',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: new Date()
    },
    comments: [comment_1.commentSchema]
});
const Feedback = mongoose_1.default.model('feedback', feedbackSchema);
exports.Feedback = Feedback;
//# sourceMappingURL=feedback.js.map