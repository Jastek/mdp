"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.utilsRoutes = void 0;
const express = __importStar(require("express"));
const team_1 = require("../models/team");
const position_1 = require("../models/position");
const chapter_1 = require("../models/chapter");
const person_1 = require("../models/person");
const api_response_1 = require("../classes/api-response");
const hard_habilities_1 = require("../models/hard-habilities");
const resource_1 = require("../models/resource");
const router = express.Router();
exports.utilsRoutes = router;
/**
 * People forms data for combos
 */
router.get('/utils/forms/people', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {};
        data.positions = yield position_1.Position.find({}).sort({ order: 'asc' });
        data.teams = yield team_1.Team.find({}).sort({ name: 'desc' });
        data.chapters = yield chapter_1.Chapter.find({}).sort({ name: 'desc' });
        data.admins = yield person_1.Person.find({ isAdmin: true }).sort({ name: 'desc' });
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
router.get('/utils/lists/hard-habilities', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {};
        data.positions = yield position_1.Position.find({}).sort({ order: 'asc' });
        data.teams = yield team_1.Team.find({}).sort({ name: 'desc' });
        data.chapters = yield chapter_1.Chapter.find({}).sort({ name: 'desc' });
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
router.get('/utils/forms/hard-habilities', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {};
        data.positions = yield position_1.Position.find({}).sort({ order: 'asc' });
        data.teams = yield team_1.Team.find({}).sort({ name: 'desc' });
        data.chapters = yield chapter_1.Chapter.find({}).sort({ name: 'desc' });
        data.resources = yield resource_1.Resource.find({}).sort({ name: 'desc' });
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
router.get('/utils/forms/resources', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {};
        data.people = yield person_1.Person.find({}).sort({ lastName1: 'desc' });
        data.hardHabilities = yield hard_habilities_1.HardHability.find({}).sort({ name: 'desc' });
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
router.get('/utils/forms/hard-evaluation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = {};
        data.hardHabilities = yield hard_habilities_1.HardHability.find({}).sort({ category: 'asc', name: 'asc' });
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
//# sourceMappingURL=utils.routes.js.map