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
exports.positionsRoutes = void 0;
const express = __importStar(require("express"));
const position_1 = require("../models/position");
const api_response_1 = require("../classes/api-response");
const person_1 = require("../models/person");
const format_search_1 = require("../helpers/format-search");
const format_order_1 = require("../helpers/format-order");
const mongodb_1 = require("mongodb");
const router = express.Router();
exports.positionsRoutes = router;
const params = {
    defaultColumn: 'name',
    defaultOrder: 'DESC',
    searchColumns: ['name']
};
/**
 * List paginated
 */
router.get('/positions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const search = (0, format_search_1.formatSearch)(req.query.search, params.searchColumns);
        const order = (0, format_order_1.formatOrder)(req.query.order_column || params.defaultColumn, req.query.order_direction || params.defaultOrder);
        const limit = +process.env.MAX_ITEMS_PER_PAGE;
        const offset = ((+req.query.page || 1) - 1) * limit;
        const count = yield position_1.Position.count(search);
        const data = yield position_1.Position.find(search).sort(order).limit(limit).skip(offset);
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data, count));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * List all paginated
 */
router.get('/positions/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield position_1.Position.find({});
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * Get by id
 */
router.get('/positions/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const id = req.params.id;
        if (!id)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        const data = yield position_1.Position.findById(id);
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * Get people who have finished this course
 */
router.get('/positions/:id/people', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        // const data = await Resource.findById(id);
        const data = yield person_1.Person.find({
            'position': new mongodb_1.ObjectId(id)
        })
            .select("_id firstName lastName1 lastName2");
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * Create
 */
router.post('/positions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const position = new position_1.Position(req.body);
        const result = yield position.save();
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
router.patch('/positions/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const id = req.params.id;
        if (!id)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        const updateData = req.body;
        const result = yield position_1.Position.findByIdAndUpdate(id, updateData);
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(result));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
router.delete('/positions/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const id = req.params.id;
        if (!id)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        const person = yield position_1.Position.findByIdAndDelete(id);
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(person));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
//# sourceMappingURL=positions.routes.js.map