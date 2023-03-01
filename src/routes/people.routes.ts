import * as express from "express";
import {Person, IPerson, IAssignedResource, AssignedResource} from "../models/person";
import { ApiResponse } from "../classes/api-response";
import { ObjectId } from "mongodb";
import * as _ from "lodash";
import { formatSearch, regexField } from "../helpers/format-search";
import { formatOrder } from "../helpers/format-order";
import { downloadCSV } from '../helpers/download-csv';
import { getPlatform } from '../helpers/platform-list';
import { AssignedResourceReportLine } from "../helpers/interfaces/assigned-resources.interface";
import { countReset } from "console";
import { ICourseTotal} from '../models/interfaces/iCourseTotal';

const router = express.Router();

const params = {
    defaultColumn: 'lastName1',
    defaultOrder: 'ASC',
    searchColumns:['firstName', 'lastName1', 'lastName2', 'email']
}

/**
 * List paginated
 */
router.get('/people', async ( req: any, res) => {
    try {
        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');

        const search = formatSearch(req.query.search, params.searchColumns);
        const order  = formatOrder(req.query.order_column||params.defaultColumn, req.query.order_direction||params.defaultOrder);

        const limit: number = +process.env.MAX_ITEMS_PER_PAGE;
        const offset: number = ((+req.query.page||1)-1)*limit;

        const count = await Person.count(search);
        const data = await Person
            .find(search)
            .populate('reportsTo')
            .populate('team')
            .populate('chapter')
            .populate('position')
            .sort(order)
            .limit(limit)
            .skip(offset);

        res.status(200).send(ApiResponse.buildSuccess(data, count));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * List paginated career list
 */
 router.get('/people/careers/:year', async ( req: any, res) => {
    try {
        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');

        const limit: number = +process.env.MAX_ITEMS_PER_PAGE;
        const offset: number = ((+req.query.page||1)-1)*limit;

        const year = req.params.year ? Number(req.params.year) : new Date().getFullYear();

        let count: any = 0;

        const people = await Person
            .aggregate([
                { $unwind: "$assignedResources" },
                { $lookup: {
                    from: 'resources',
                    localField: 'assignedResources.resource',
                    foreignField: '_id',
                    as: 'assignedResources.resource'
                }},
                { $sort: { 'firstName': 1, 'lastName1': 1 }},
                { $match: { "assignedResources.plan": year }},
                { $skip: offset},
                { $limit: limit }

            ]);

        if (people?.length > 0) {
            count = await Person
                .aggregate([
                    { $unwind: "$assignedResources" },
                    { $match: { "assignedResources.plan": year }},
                    { $count: "count" }
                ]);
        }

        res.status(200).send(ApiResponse.buildSuccess(people, count[0]?.count));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * List paginated career list
 */
router.get('/people/year-plan/:year', async ( req: any, res) => {
    try {
        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');

        const year = req.params.year ? Number(req.params.year) : new Date().getFullYear();

        const people = await (await Person
            .find({}, {"assignedResources": 0})
            .populate('chapter')
            .sort({firstName: 'asc', lastName1: 'asc'}))
            .map( x=> x.toObject());

        const peopleIds = people.map(x=> x._id);

        const assignedResources = await Person.aggregate([
            { $unwind: '$assignedResources'},
            { $match: {'assignedResources.plan': year, '_id': {$in: peopleIds}}},
            { $lookup: {
                from: 'resources',
                localField: 'assignedResources.resource',
                foreignField: '_id',
                as: 'assignedResources.resource'
            }},
            { $project: {"_id": 1, "assignedResources": 1} }
       ]);

        people.forEach( (element:any) => {
            element.assignedResources = assignedResources.filter(x=> x._id.equals(element._id));

            const totals: ICourseTotal = {
                minutes: 0,
                hours: 0,
                days: 0,
                totalHours: 0.0,
                totalHoursComplete: 0.0
            };

            element.assignedResources.forEach( (course:any) => {
                totals.days += Number(course.assignedResources.resource[0].duration.days);
                totals.hours += Number(course.assignedResources.resource[0].duration.hours);
                totals.minutes += Number(course.assignedResources.resource[0].duration.minutes);

                let totalMinutes: number = 0;

                totalMinutes += totals.minutes;
                totalMinutes += +totals.hours * 60;
                totalMinutes += +totals.days * 24 * 60;

                totals.totalHours = _.round(totalMinutes / 60, 2);

                totals.totalHoursComplete = course.assignedResources[0].progress;

            });

            element.totals = totals;
        });

        res.status(200).send(ApiResponse.buildSuccess(people, 0));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * List paginated
 */
 router.get('/people/all', async ( req: any, res) => {
    try {
        const data = await Person
            .find({})

        res.status(200).send(ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * Get myself info
 */
 router.get('/people/myself', async (req:any, res)=>{
    try {
        const data = await Person
            .findOne({email: req.user.email})
            .populate('reportsTo')
            .populate('team')
            .populate('chapter')
            .populate('position')
            .populate('assignedResources.resource');

        res.status(200).send(ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
})

/**
 * Get by id
 */
router.get('/people/:id', async ( req: any, res) => {
    try {
        const id = req.params.id;

        if ( !(req.user.isAdmin || id === req.user._id) ) return res.status(401).send('Not Authorized');
        if (!id) res.status(400).send(ApiResponse.buildError("Not authorized"));

        const data = await Person
            .findById(id)
            .populate('reportsTo')
            .populate('team')
            .populate('chapter')
            .populate('position')
            .populate('assignedResources.resource');

        res.status(200).send(ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});



/**
 * Create
 */
router.post('/people', async (req: any, res) => {
    try {
        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');

        const person = new Person(req.body);
        const result = await person.save();

        res.status(200).send(ApiResponse.buildSuccess(result));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        // console.log(err);

        res.status(500).send(ApiResponse.buildError(err.toString()));
    }
});

/**
 * Add assigned resource
 */
 router.post('/people/:id/assign-resource', async (req: any, res) => {
    try {

        const id = req.params.id;
        const idResource = req.body.idResource;

        const plan = req.body.plan ||  new Date().getFullYear();

        if ( !(req.user.isAdmin || id === req.user._id) ) return res.status(401).send('Not Authorized');
        if (!id || !idResource) res.status(400).send(ApiResponse.buildError("Not authorized"));


        const assignedResource = new AssignedResource();
        assignedResource.resource = new ObjectId(idResource);
        assignedResource.plan = plan;


        const data = await Person.findByIdAndUpdate(id, {
            $addToSet: {
                assignedResources: assignedResource
            }
        });

        res.status(200).send(ApiResponse.buildSuccess(true));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);

        res.status(500).send(ApiResponse.buildError(err.toString()));
    }
});

/**
 * Add assigned resource
 */
 router.patch('/people/:id/remove-resource', async (req: any, res) => {
    try {
        const id = req.params.id;
        const idResource = req.body.idResource;

        if ( !(req.user.isAdmin || id === req.user._id) ) return res.status(401).send('Not Authorized');
        if (!id || !idResource) res.status(400).send(ApiResponse.buildError("Not authorized"));

        await Person.findByIdAndUpdate(id, { $pull: { 'assignedResources': { resource: idResource }} })

        res.status(200).send(ApiResponse.buildSuccess(true));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        // console.log(err);

        res.status(500).send(ApiResponse.buildError(err.toString()));
    }
});

/**
 * Update assigned resource
 */
router.patch('/people/:id/modify-resource', async (req: any, res) => {
    try {
        const id = req.params.id;
        const idResource = req.body._id;

        const data: any = {
            "assignedResources.$.status": req.body.status,
            "assignedResources.$.progress": req.body.progress,
            "assignedResources.$.plan": req.body.plan
        }

        if ( !(req.user.isAdmin || id === req.user._id) ) return res.status(401).send('Not Authorized');
        if (!id || !idResource) res.status(400).send(ApiResponse.buildError("Not authorized"));

        switch(data["assignedResources.$.status"]) {
            case "progress":
                data["assignedResources.$.startDate"] = new Date();
                break;
            case "finished":
                data["assignedResources.$.finishDate"] = new Date();
                data["assignedResources.$.progress"] = 10;
                break;
        }

        await Person.updateOne(
            {_id: new ObjectId(id), "assignedResources._id": new ObjectId(idResource)},
            { $set: data });

        const responseData:any = {
            status: data["assignedResources.$.status"],
            progress: data["assignedResources.$.progress"],
            startDate: data["assignedResources.$.startDate"],
            endDate: data["assignedResources.$.endDate"]
        }

        res.status(200).send(ApiResponse.buildSuccess(responseData));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        // console.log(err);

        res.status(500).send(ApiResponse.buildError(err.toString()));
    }
});


/**
 * Update
 */
 router.patch('/people/:id', async (req: any, res) => {
    try {
        const id = req.params.id;

        if ( !(req.user.isAdmin || id === req.user._id) ) return res.status(401).send('Not Authorized');
        if (!id) res.status(400).send(ApiResponse.buildError("Not authorized"));

        const updateData = req.body;
        const result = await Person.findByIdAndUpdate(id, updateData);

        res.status(200).send(ApiResponse.buildSuccess(result));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);

        res.status(500).send(ApiResponse.buildError(err));
    }
});

router.delete('/people/:id', async (req:any, res) => {
    try {
        const id = req.params.id;

        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');
        if (!id) res.status(400).send(ApiResponse.buildError("Not authorized"));

        const person = await Person.findByIdAndDelete(id);

        res.status(200).send(ApiResponse.buildSuccess(person));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);

        res.status(500).send(ApiResponse.buildError(err));
    }
});

router.get('/people/:id/download-assigned-resources/:year', async (req:any, res) => {
    try {
        const id = req.params.id;
        const year = req.params.year ? Number(req.params.year) : new Date().getFullYear();

        const person = await Person.findById(id).populate('reportsTo');

        const aggregate = [
            { $unwind: "$assignedResources" },
            { $lookup: {
                        from: 'resources',
                        localField: 'assignedResources.resource',
                        foreignField: '_id',
                        as: 'assignedResources.resource'
                    }},
            { $match: { "_id": new ObjectId(id) }},
            { $match: { "assignedResources.plan": year }},
            { $project: { '_id': 0, 'assignedResources': 1 } }
        ];

        let data = await Person
            .aggregate(aggregate);

        data = data.map( (x:any) => x.assignedResources);
        data.map( (x:any) => x.person = `${person.firstName} ${person.lastName1} ${person.lastName2}`);

        // tslint:disable-next-line:no-console
        console.log(data);

         const fields = [
            {
                label: 'Nombre del colaborador',
                value: 'person'
            },
            {
                label: 'Recurso',
                value: (row:any) => row.resource[0].name
            },
            {
                label: 'Horas planificadas',
                value: (row:any) => `${ (row.resource[0].duration.days*24 + row.resource[0].duration.hours)}:${row.resource[0].duration.minutes}:00`
            },
            {
                label: 'Plataforma',
                value: (row:any) => getPlatform(row.resource[0].platform)
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
                value: (row:any) => `${row.progress}%`
            },
            {
                label: 'Estado',
                value: 'status'
            },
         ]

        let csv:any;

        if ( data !== null ) {
            csv = await downloadCSV(res, 'test', fields, data );
        }

        res.status(200).send(ApiResponse.buildSuccess(csv));


    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

export { router as peopleRoutes }