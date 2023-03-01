"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chapter = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chapterSchema = new mongoose_1.default.Schema({
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
const Chapter = mongoose_1.default.model('chapter', chapterSchema);
exports.Chapter = Chapter;
//# sourceMappingURL=chapter.js.map