"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HardEvaluation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Hard evaluation element schema
 */
const hardEvalElementSchema = new mongoose_1.default.Schema({
    calification: {
        type: Number,
        required: false,
    },
    hardHability: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "hardHability"
    },
    hardHabilityName: {
        type: String,
        required: true
    },
    hardCategoryName: {
        type: String,
        required: true
    }
});
/**
 * Hard evaluation element
 */
const hardEvaluationSchema = new mongoose_1.default.Schema({
    person: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "person",
        immutable: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    finishDate: {
        type: Date,
        required: false
    },
    califications: [hardEvalElementSchema],
});
const HardEvaluation = mongoose_1.default.model('hardEvaluation', hardEvaluationSchema);
exports.HardEvaluation = HardEvaluation;
//# sourceMappingURL=hard-evaluation.js.map