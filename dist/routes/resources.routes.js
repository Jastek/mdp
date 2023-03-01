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
exports.resourcesRoutes = void 0;
const express = __importStar(require("express"));
const resource_1 = require("../models/resource");
const person_1 = require("../models/person");
const hard_habilities_1 = require("../models/hard-habilities");
const api_response_1 = require("../classes/api-response");
const array_difference_1 = require("../helpers/array-difference");
const mongodb_1 = require("mongodb");
const format_search_1 = require("../helpers/format-search");
const format_order_1 = require("../helpers/format-order");
const router = express.Router();
exports.resourcesRoutes = router;
const params = {
    defaultColumn: 'name',
    defaultOrder: 'DESC',
    searchColumns: ['name', 'url']
};
/**
 * List paginated
 */
router.get('/resources', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const search = (0, format_search_1.formatSearch)(req.query.search, params.searchColumns);
        const order = (0, format_order_1.formatOrder)(req.query.order_column || params.defaultColumn, req.query.order_direction || params.defaultOrder);
        const limit = +process.env.MAX_ITEMS_PER_PAGE;
        const offset = ((+req.query.page || 1) - 1) * limit;
        const count = yield resource_1.Resource.count(search);
        const data = yield resource_1.Resource.find(search).sort(order).limit(limit).skip(offset);
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data, count));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * List all
 */
router.get('/resources/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield resource_1.Resource.find({});
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * List all from hardhability
 */
router.get('/resources/by-hard-hability/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        const objectId = new mongodb_1.ObjectId(id);
        const data = yield resource_1.Resource.find({ hardHabilities: objectId });
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * Get by id
 */
router.get('/resources/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        const data = yield resource_1.Resource.findById(id);
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * Get people who have finished this course
 */
router.get('/resources/:id/people', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        // const data = await Resource.findById(id);
        const data = yield person_1.Person.find({
            'assignedResources': {
                $elemMatch: {
                    resource: new mongodb_1.ObjectId(id),
                    status: 'finished'
                }
            }
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
router.post('/resources', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resource = new resource_1.Resource(req.body);
        let result = yield resource.save();
        result = yield hard_habilities_1.HardHability.updateMany({ '_id': resource.hardHabilities }, { $addToSet: { 'resources': resource._id } });
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(result));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        res.status(500).send(api_response_1.ApiResponse.buildError(err.toString()));
    }
}));
/**
 * Update
 */
router.patch('/resources/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = req.params.id;
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        if (!_id)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        const data = req.body;
        const newhardHabilities = data.hardHabilities || [];
        const oldResource = yield resource_1.Resource.findOne({ _id });
        const oldHardHabilities = oldResource.hardHabilities;
        Object.assign(oldResource, data);
        const newResource = yield oldResource.save();
        const added = (0, array_difference_1.arrayDifference)(newhardHabilities, oldHardHabilities);
        const removed = (0, array_difference_1.arrayDifference)(oldHardHabilities, newhardHabilities);
        yield hard_habilities_1.HardHability.updateMany({ '_id': added }, { $addToSet: { resources: newResource._id } });
        yield hard_habilities_1.HardHability.updateMany({ '_id': removed }, { $pull: { resources: newResource._id } });
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(true));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
router.delete('/resources/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const _id = req.params.id;
        if (!_id)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        const resource = yield resource_1.Resource.findOne({ _id });
        yield resource.remove();
        yield hard_habilities_1.HardHability.updateMany({ '_id': resource.hardHabilities }, { $pull: { resources: resource._id } });
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(true));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
//# sourceMappingURL=resources.routes.js.map