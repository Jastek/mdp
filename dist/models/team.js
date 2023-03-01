"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Team = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const teamSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true
    }
});
const Team = mongoose_1.default.model('team', teamSchema);
exports.Team = Team;
//# sourceMappingURL=team.js.map