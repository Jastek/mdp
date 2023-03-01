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
exports.feedbackRoutes = void 0;
const express = __importStar(require("express"));
const feedback_1 = require("../models/feedback");
const api_response_1 = require("../classes/api-response");
const mongodb_1 = require("mongodb");
const router = express.Router();
exports.feedbackRoutes = router;
/**
 * List paginated praises feedbacks
 */
router.get('/feedback/to/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!(req.user.isAdmin || id === req.user._id))
            return res.status(401).send('Not Authorized');
        const limit = +process.env.MAX_ITEMS_PER_PAGE;
        const offset = ((+req.query.page || 1) - 1) * limit;
        const query = { to: new mongodb_1.ObjectId(id) };
        const count = yield feedback_1.Feedback.count(query);
        const data = yield feedback_1.Feedback.find(query)
            .populate('to')
            .populate('from')
            .sort({ date: 'desc' })
            .limit(limit)
            .skip(offset);
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data, count));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * List paginated praises feedbacks
 */
router.get('/feedback/from/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!(req.user.isAdmin || id === req.user._id))
            return res.status(401).send('Not Authorized');
        const limit = +process.env.MAX_ITEMS_PER_PAGE;
        const offset = ((+req.query.page || 1) - 1) * limit;
        const query = { from: new mongodb_1.ObjectId(id) };
        const count = yield feedback_1.Feedback.count(query);
        const data = yield feedback_1.Feedback.find(query)
            .populate('to')
            .populate('from')
            .sort({ date: 'desc' })
            .limit(limit)
            .skip(offset);
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data, count));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * Create praise
 */
router.post('/feedback/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const feedback = new feedback_1.Feedback(req.body);
        feedback.from = new mongodb_1.ObjectId(req.user._id);
        feedback.to = new mongodb_1.ObjectId(id);
        const result = yield feedback.save();
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(result));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        // console.log(err);
        res.status(500).send(api_response_1.ApiResponse.buildError(err.toString()));
    }
}));
router.delete('/feedback/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const feedback = yield feedback_1.Feedback.findById(id);
        if (feedback.from !== req.user._id)
            return res.status(401).send('Not Authorized');
        const result = yield feedback_1.Feedback.findByIdAndDelete(id);
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(result));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err.toString()));
    }
}));
//# sourceMappingURL=feedback.routes.js.map