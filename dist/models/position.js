"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Position = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const positionSchema = new mongoose_1.default.Schema({
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
        required: true
    },
    order: {
        type: Number,
        required: true
    }
});
const Position = mongoose_1.default.model('position', positionSchema);
exports.Position = Position;
//# sourceMappingURL=position.js.map