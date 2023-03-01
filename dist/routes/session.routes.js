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
exports.sessionsRoutes = void 0;
const express = __importStar(require("express"));
const session_1 = require("../models/session");
const api_response_1 = require("../classes/api-response");
const format_search_1 = require("../helpers/format-search");
const format_order_1 = require("../helpers/format-order");
const router = express.Router();
exports.sessionsRoutes = router;
const params = {
    defaultColumn: 'date',
    defaultOrder: 'DESC',
    searchColumns: ['to.firstName', 'to.lastName1', 'to.lastName2']
};
/**
 * List paginated
 */
router.get('/sessions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const search = (0, format_search_1.formatSearch)(req.query.search, params.searchColumns);
        const order = (0, format_order_1.formatOrder)(req.query.order_column || params.defaultColumn, req.query.order_direction || params.defaultOrder);
        const limit = +process.env.MAX_ITEMS_PER_PAGE;
        const offset = ((+req.query.page || 1) - 1) * limit;
        const aggregate = [
            {
                $lookup: {
                    from: 'people',
                    localField: 'to',
                    foreignField: '_id',
                    as: 'to'
                }
            },
            { $match: search }
        ];
        const data = yield session_1.Session
            .aggregate(aggregate)
            .sort(order)
            .limit(limit)
            .skip(offset);
        let count = 0;
        if ((data || []).length > 0) {
            count = yield session_1.Session
                .aggregate(aggregate)
                .count('count');
            count = count[0].count;
        }
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data, count));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * Get by id
 */
router.get('/sessions/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const id = req.params.id;
        if (!id)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        const data = yield session_1.Session.findById(id).populate('to');
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * Create
 */
router.post('/sessions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const session = new session_1.Session(req.body);
        session.from = req.user._id;
        const result = yield session.save();
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
router.patch('/sessions/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const id = req.params.id;
        if (!id)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        const updateData = req.body;
        const result = yield session_1.Session.findByIdAndUpdate(id, updateData);
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(result));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
//# sourceMappingURL=session.routes.js.map