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
exports.hardHabilitiesRoutes = void 0;
const express = __importStar(require("express"));
const hard_habilities_1 = require("../models/hard-habilities");
const resource_1 = require("../models/resource");
const api_response_1 = require("../classes/api-response");
const array_difference_1 = require("../helpers/array-difference");
const format_search_1 = require("../helpers/format-search");
const format_order_1 = require("../helpers/format-order");
const mongodb_1 = require("mongodb");
const router = express.Router();
exports.hardHabilitiesRoutes = router;
const params = {
    defaultColumn: 'category',
    defaultOrder: 'DESC',
    searchColumns: ['category', 'name']
};
/**
 * List paginated
 */
router.get('/hard-habilities', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const search = (0, format_search_1.formatSearch)(req.query.search, params.searchColumns);
        const order = (0, format_order_1.formatOrder)(req.query.order_column || params.defaultColumn, req.query.order_direction || params.defaultOrder);
        const limit = +process.env.MAX_ITEMS_PER_PAGE;
        const offset = ((+req.query.page || 1) - 1) * limit;
        const count = yield hard_habilities_1.HardHability.count(search);
        const data = yield hard_habilities_1.HardHability.find(search).sort(order).limit(limit).skip(offset);
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data, count));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * List all paginated
 */
router.get('/hard-habilities/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield hard_habilities_1.HardHability.find({}).sort({ category: 'desc', name: 'desc' });
        ;
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * Get by id
 */
router.get('/hard-habilities/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const id = req.params.id;
        if (!id)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        const data = yield hard_habilities_1.HardHability.findById(id);
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * Create
 */
router.post('/hard-habilities', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const hardHability = new hard_habilities_1.HardHability(req.body);
        let result = yield hardHability.save();
        result = yield resource_1.Resource.updateMany({ '_id': hardHability.resources }, { $addToSet: { 'hardHabilities': hardHability._id } });
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
router.patch('/hard-habilities/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = req.params.id;
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        if (!_id)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        // const updateData = req.body;
        // const result = await HardHability.findByIdAndUpdate(id, updateData);
        const data = req.body;
        const newResources = data.resources || [];
        const oldHardHability = yield hard_habilities_1.HardHability.findOne({ _id });
        const oldResources = oldHardHability.resources;
        Object.assign(oldHardHability, data);
        const newHardHability = yield oldHardHability.save();
        const added = (0, array_difference_1.arrayDifference)(newResources, oldResources);
        const removed = (0, array_difference_1.arrayDifference)(oldResources, newResources);
        yield resource_1.Resource.updateMany({ '_id': added }, { $addToSet: { hardHabilities: newHardHability._id } });
        yield resource_1.Resource.updateMany({ '_id': removed }, { $pull: { hardHabilities: newHardHability._id } });
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(true));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
router.delete('/hard-habilities/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const _id = req.params.id;
        if (!_id)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        const hardHability = yield hard_habilities_1.HardHability.findOne({ _id });
        yield hardHability.remove();
        yield resource_1.Resource.updateMany({ '_id': hardHability.resources }, { $pull: { hardHabilities: hardHability._id } });
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(true));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
router.patch('/hard-habilities/:id/edit-ponderation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!(req.user.isAdmin))
            return res.status(401).send('Not Authorized');
        const hardHability = yield hard_habilities_1.HardHability.findById(id);
        if (!hardHability)
            return res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        const idEntity = req.body._id;
        const fieldName = req.body.fieldName;
        const arrayName = fieldName + 'Ponds';
        const fullField = fieldName + "Ponds.$.ponderation";
        const idField = arrayName + '.' + fieldName;
        const updateQuery = { _id: new mongodb_1.ObjectId(id) };
        const update = {};
        if (hardHability[arrayName].find((x) => x[fieldName].toString() === idEntity)) {
            updateQuery[idField] = new mongodb_1.ObjectId(idEntity);
            update[fullField] = req.body.ponderation;
            yield hard_habilities_1.HardHability.updateOne(updateQuery, { $set: update });
        }
        else {
            const ponderation = {};
            ponderation[fieldName] = new mongodb_1.ObjectId(idEntity);
            ponderation.ponderation = req.body.ponderation;
            update[arrayName] = ponderation;
            yield hard_habilities_1.HardHability.updateOne(updateQuery, { $addToSet: update });
        }
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(true));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        res.status(500).send(api_response_1.ApiResponse.buildError(err.toString()));
    }
}));
//# sourceMappingURL=hard-habilities.routes.js.map