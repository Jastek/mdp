"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentSchema = exports.Comment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const commentSchema = new mongoose_1.default.Schema({
    from: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.commentSchema = commentSchema;
// commentSchema.add({
//     comments: [commentSchema]
// })
const Comment = mongoose_1.default.model('comment', commentSchema);
exports.Comment = Comment;
//# sourceMappingURL=comment.js.map