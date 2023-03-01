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
exports.peopleRoutes = void 0;
const express = __importStar(require("express"));
const person_1 = require("../models/person");
const api_response_1 = require("../classes/api-response");
const mongodb_1 = require("mongodb");
const _ = __importStar(require("lodash"));
const format_search_1 = require("../helpers/format-search");
const format_order_1 = require("../helpers/format-order");
const download_csv_1 = require("../helpers/download-csv");
const platform_list_1 = require("../helpers/platform-list");
const router = express.Router();
exports.peopleRoutes = router;
const params = {
    defaultColumn: 'lastName1',
    defaultOrder: 'ASC',
    searchColumns: ['firstName', 'lastName1', 'lastName2', 'email']
};
/**
 * List paginated
 */
router.get('/people', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const search = (0, format_search_1.formatSearch)(req.query.search, params.searchColumns);
        const order = (0, format_order_1.formatOrder)(req.query.order_column || params.defaultColumn, req.query.order_direction || params.defaultOrder);
        const limit = +process.env.MAX_ITEMS_PER_PAGE;
        const offset = ((+req.query.page || 1) - 1) * limit;
        const count = yield person_1.Person.count(search);
        const data = yield person_1.Person
            .find(search)
            .populate('reportsTo')
            .populate('team')
            .populate('chapter')
            .populate('position')
            .sort(order)
            .limit(limit)
            .skip(offset);
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data, count));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * List paginated career list
 */
router.get('/people/careers/:year', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const limit = +process.env.MAX_ITEMS_PER_PAGE;
        const offset = ((+req.query.page || 1) - 1) * limit;
        const year = req.params.year ? Number(req.params.year) : new Date().getFullYear();
        let count = 0;
        const people = yield person_1.Person
            .aggregate([
            { $unwind: "$assignedResources" },
            { $lookup: {
                    from: 'resources',
                    localField: 'assignedResources.resource',
                    foreignField: '_id',
                    as: 'assignedResources.resource'
                } },
            { $sort: { 'firstName': 1, 'lastName1': 1 } },
            { $match: { "assignedResources.plan": year } },
            { $skip: offset },
            { $limit: limit }
        ]);
        if ((people === null || people === void 0 ? void 0 : people.length) > 0) {
            count = yield person_1.Person
                .aggregate([
                { $unwind: "$assignedResources" },
                { $match: { "assignedResources.plan": year } },
                { $count: "count" }
            ]);
        }
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(people, (_a = count[0]) === null || _a === void 0 ? void 0 : _a.count));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * List paginated career list
 */
router.get('/people/year-plan/:year', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const year = req.params.year ? Number(req.params.year) : new Date().getFullYear();
        const people = yield (yield person_1.Person
            .find({}, { "assignedResources": 0 })
            .populate('chapter')
            .sort({ firstName: 'asc', lastName1: 'asc' }))
            .map(x => x.toObject());
        const peopleIds = people.map(x => x._id);
        const assignedResources = yield person_1.Person.aggregate([
            { $unwind: '$assignedResources' },
            { $match: { 'assignedResources.plan': year, '_id': { $in: peopleIds } } },
            { $lookup: {
                    from: 'resources',
                    localField: 'assignedResources.resource',
                    foreignField: '_id',
                    as: 'assignedResources.resource'
                } },
            { $project: { "_id": 1, "assignedResources": 1 } }
        ]);
        people.forEach((element) => {
            element.assignedResources = assignedResources.filter(x => x._id.equals(element._id));
            const totals = {
                minutes: 0,
                hours: 0,
                days: 0,
                totalHours: 0.0,
                totalHoursComplete: 0.0
            };
            element.assignedResources.forEach((course) => {
                totals.days += Number(course.assignedResources.resource[0].duration.days);
                totals.hours += Number(course.assignedResources.resource[0].duration.hours);
                totals.minutes += Number(course.assignedResources.resource[0].duration.minutes);
                let totalMinutes = 0;
                totalMinutes += totals.minutes;
                totalMinutes += +totals.hours * 60;
                totalMinutes += +totals.days * 24 * 60;
                totals.totalHours = _.round(totalMinutes / 60, 2);
                totals.totalHoursComplete = course.assignedResources[0].progress;
            });
            element.totals = totals;
        });
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(people, 0));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * List paginated
 */
router.get('/people/all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield person_1.Person
            .find({});
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * Get myself info
 */
router.get('/people/myself', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield person_1.Person
            .findOne({ email: req.user.email })
            .populate('reportsTo')
            .populate('team')
            .populate('chapter')
            .populate('position')
            .populate('assignedResources.resource');
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * Get by id
 */
router.get('/people/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!(req.user.isAdmin || id === req.user._id))
            return res.status(401).send('Not Authorized');
        if (!id)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        const data = yield person_1.Person
            .findById(id)
            .populate('reportsTo')
            .populate('team')
            .populate('chapter')
            .populate('position')
            .populate('assignedResources.resource');
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
/**
 * Create
 */
router.post('/people', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        const person = new person_1.Person(req.body);
        const result = yield person.save();
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(result));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        // console.log(err);
        res.status(500).send(api_response_1.ApiResponse.buildError(err.toString()));
    }
}));
/**
 * Add assigned resource
 */
router.post('/people/:id/assign-resource', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const idResource = req.body.idResource;
        const plan = req.body.plan || new Date().getFullYear();
        if (!(req.user.isAdmin || id === req.user._id))
            return res.status(401).send('Not Authorized');
        if (!id || !idResource)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        const assignedResource = new person_1.AssignedResource();
        assignedResource.resource = new mongodb_1.ObjectId(idResource);
        assignedResource.plan = plan;
        const data = yield person_1.Person.findByIdAndUpdate(id, {
            $addToSet: {
                assignedResources: assignedResource
            }
        });
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(true));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        res.status(500).send(api_response_1.ApiResponse.buildError(err.toString()));
    }
}));
/**
 * Add assigned resource
 */
router.patch('/people/:id/remove-resource', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const idResource = req.body.idResource;
        if (!(req.user.isAdmin || id === req.user._id))
            return res.status(401).send('Not Authorized');
        if (!id || !idResource)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        yield person_1.Person.findByIdAndUpdate(id, { $pull: { 'assignedResources': { resource: idResource } } });
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(true));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        // console.log(err);
        res.status(500).send(api_response_1.ApiResponse.buildError(err.toString()));
    }
}));
/**
 * Update assigned resource
 */
router.patch('/people/:id/modify-resource', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const idResource = req.body._id;
        const data = {
            "assignedResources.$.status": req.body.status,
            "assignedResources.$.progress": req.body.progress,
            "assignedResources.$.plan": req.body.plan
        };
        if (!(req.user.isAdmin || id === req.user._id))
            return res.status(401).send('Not Authorized');
        if (!id || !idResource)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        switch (data["assignedResources.$.status"]) {
            case "progress":
                data["assignedResources.$.startDate"] = new Date();
                break;
            case "finished":
                data["assignedResources.$.finishDate"] = new Date();
                data["assignedResources.$.progress"] = 10;
                break;
        }
        yield person_1.Person.updateOne({ _id: new mongodb_1.ObjectId(id), "assignedResources._id": new mongodb_1.ObjectId(idResource) }, { $set: data });
        const responseData = {
            status: data["assignedResources.$.status"],
            progress: data["assignedResources.$.progress"],
            startDate: data["assignedResources.$.startDate"],
            endDate: data["assignedResources.$.endDate"]
        };
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(responseData));
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
router.patch('/people/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!(req.user.isAdmin || id === req.user._id))
            return res.status(401).send('Not Authorized');
        if (!id)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        const updateData = req.body;
        const result = yield person_1.Person.findByIdAndUpdate(id, updateData);
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(result));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
router.delete('/people/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!req.user.isAdmin)
            return res.status(401).send('Not Authorized');
        if (!id)
            res.status(400).send(api_response_1.ApiResponse.buildError("Not authorized"));
        const person = yield person_1.Person.findByIdAndDelete(id);
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(person));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
router.get('/people/:id/download-assigned-resources/:year', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const year = req.params.year ? Number(req.params.year) : new Date().getFullYear();
        const person = yield person_1.Person.findById(id).populate('reportsTo');
        const aggregate = [
            { $unwind: "$assignedResources" },
            { $lookup: {
                    from: 'resources',
                    localField: 'assignedResources.resource',
                    foreignField: '_id',
                    as: 'assignedResources.resource'
                } },
            { $match: { "_id": new mongodb_1.ObjectId(id) } },
            { $match: { "assignedResources.plan": year } },
            { $project: { '_id': 0, 'assignedResources': 1 } }
        ];
        let data = yield person_1.Person
            .aggregate(aggregate);
        data = data.map((x) => x.assignedResources);
        data.map((x) => x.person = `${person.firstName} ${person.lastName1} ${person.lastName2}`);
        // tslint:disable-next-line:no-console
        console.log(data);
        const fields = [
            {
                label: 'Nombre del colaborador',
                value: 'person'
            },
            {
                label: 'Recurso',
                value: (row) => row.resource[0].name
            },
            {
                label: 'Horas planificadas',
                value: (row) => `${(row.resource[0].duration.days * 24 + row.resource[0].duration.hours)}:${row.resource[0].duration.minutes}:00`
            },
            {
                label: 'Plataforma',
                value: (row) => (0, platform_list_1.getPlatform)(row.resource[0].platform)
            },
            {
                label: 'Fecha de inicio',
                value: 'startDate'
            },
            {
                label: 'Fecha de finalización',
                value: 'finishDate'
            },
            {
                label: 'Progreso',
                value: (row) => `${row.progress}%`
            },
            {
                label: 'Estado',
                value: 'status'
            },
        ];
        let csv;
        if (data !== null) {
            csv = yield (0, download_csv_1.downloadCSV)(res, 'test', fields, data);
        }
        res.status(200).send(api_response_1.ApiResponse.buildSuccess(csv));
    }
    catch (err) {
        res.status(500).send(api_response_1.ApiResponse.buildError(err));
    }
}));
//# sourceMappingURL=people.routes.js.map