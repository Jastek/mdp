"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.YearPlan = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const yearPlanSchema = new mongoose_1.default.Schema({
    year: {
        type: Number,
        required: true
    },
    detail: {
        type: String,
        required: true
    }
});
const YearPlan = mongoose_1.default.model('yearPlan', yearPlanSchema);
exports.YearPlan = YearPlan;
//# sourceMappingURL=year-plan.js.map