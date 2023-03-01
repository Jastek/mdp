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
exports.hardEvalRoutes = void 0;
const express = __importStar(require("express"));
const hard_evaluation_1 = require("../models/hard-evaluation");
const api_response_1 = require("../classes/api-response");
const router = express.Router();
exports.hardEvalRoutes = router;
/**
 * List paginated
 */
router.get('/hard-evaluations', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const limit = +process.env.MAX_ITEMS_PER_PAGE;
        const offset = ((+req.query.page || 1) - 1) * limit;
        const count = yield hard_evaluation_1.HardEvaluation.count({});
        const data = yield hard_evaluation_1.HardEvaluation.find({}).populate('person').limit(limit).skip(offset);
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data, count));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * Get by id
 */
router.get('/hard-evaluations/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id)
            res.status(401).send(api_response_1.ApiResponse.buildError("Not authorized"));
        const data = yield hard_evaluation_1.HardEvaluation.findById(id);
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * List all paginated from a person
 */
router.get('/hard-evaluations/:id/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!(req.user.isAdmin || id === req.user._id))
            return res.status(401).send('Not Authorized');
        const limit = +process.env.MAX_ITEMS_PER_PAGE;
        const offset = ((+req.query.page || 1) - 1) * limit;
        const count = yield hard_evaluation_1.HardEvaluation.count({ person: id });
        const data = yield hard_evaluation_1.HardEvaluation
            .find({ person: id })
            .sort({ date: 'desc' })
            .limit(limit).skip(offset);
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data, count));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * Create
 */
router.post('/hard-evaluations', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hardEvaluation = new hard_evaluation_1.HardEvaluation(req.body);
        hardEvaluation.person = req.user._id;
        hardEvaluation.date = new Date();
        const result = yield hardEvaluation.save();
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(result));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        // console.log(err);
        res.status(500).send(api_response_1.ApiResponse.buildError(err.toString()));
    }
}));
/**
 * Update
 */
router.patch('/hard-evaluations/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        if (!id)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        const updateData = req.body;
        const result = yield hard_evaluation_1.HardEvaluation.findByIdAndUpdate(id, updateData);
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(result));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
router.delete('/hard-evaluations/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const hardEvaluation = yield hard_evaluation_1.HardEvaluation.findByIdAndDelete(id);
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(hardEvaluation));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
//# sourceMappingURL=hard-eval.routes.js.map