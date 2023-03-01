"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
;
;
const sessionItemSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});
const sessionSchema = new mongoose_1.default.Schema({
    date: {
        type: Date,
        required: true,
    },
    from: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "person",
        required: true
    },
    to: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "person",
        required: true,
        immutable: true
    },
    items: [sessionItemSchema]
});
const Session = mongoose_1.default.model('session', sessionSchema);
exports.Session = Session;
//# sourceMappingURL=session.js.map