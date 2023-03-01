import * as express from "express";
import { Resource, IResource } from "../models/resource";
import { Person } from '../models/person';
import { HardHability } from "../models/hard-habilities";
import { ApiResponse } from "../classes/api-response";
import { arrayDifference } from '../helpers/array-difference';
import { ObjectId } from "mongodb";

import { formatSearch } from "../helpers/format-search";
import { formatOrder } from "../helpers/format-order";

const router = express.Router();

const params = {
    defaultColumn: 'name',
    defaultOrder: 'DESC',
    searchColumns:['name', 'url']
}

/**
 * List paginated
 */
router.get('/resources', async ( req: any, res) => {
    try {
        const search = formatSearch(req.query.search, params.searchColumns);
        const order  = formatOrder(req.query.order_column||params.defaultColumn, req.query.order_direction||params.defaultOrder);

        const limit: number = +process.env.MAX_ITEMS_PER_PAGE;
        const offset: number = ((+req.query.page||1)-1)*limit;

        const count = await Resource.count(search);
        const data = await Resource.find(search).sort(order).limit(limit).skip(offset);

        res.status(200).send(ApiResponse.buildSuccess(data, count));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * List all
 */
 router.get('/resources/all', async ( req: any, res) => {
    try {
        const data = await Resource.find({});

        res.status(200).send(ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * List all from hardhability
 */
 router.get('/resources/by-hard-hability/:id', async ( req: any, res) => {
    try {
        const id = req.params.id;

        if (!id) res.status(400).send(ApiResponse.buildError("Not authorized"));

        const objectId = new ObjectId(id);

        const data = await Resource.find({hardHabilities: objectId});

        res.status(200).send(ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * Get by id
 */
router.get('/resources/:id', async ( req: any, res) => {
    try {
        const id = req.params.id;

        if (!id) res.status(400).send(ApiResponse.buildError("Not authorized"));

        const data = await Resource.findById(id);

        res.status(200).send(ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * Get people who have finished this course
 */
 router.get('/resources/:id/people', async ( req: any, res) => {
    try {
        const id = req.params.id;

        if (!id) res.status(400).send(ApiResponse.buildError("Not authorized"));

        // const data = await Resource.findById(id);
        const data = await Person.find({
            'assignedResources': {
                $elemMatch: {
                    resource: new ObjectId(id),
                    status: 'finished'
                }
            }
        })
        .select("_id firstName lastName1 lastName2")

        res.status(200).send(ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * Create
 */
router.post('/resources', async (req: any, res) => {
    try {
        const resource: any = new Resource(req.body);
        let result = await resource.save();

        result = await HardHability.updateMany({'_id': resource.hardHabilities}, { $addToSet: { 'resources': resource._id} });

        res.status(200).send(ApiResponse.buildSuccess(result));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);

        res.status(500).send(ApiResponse.buildError(err.toString()));
    }
});

/**
 * Update
 */
 router.patch('/resources/:id', async (req: any, res) => {
    try {
        const _id = req.params.id;

        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');
        if (!_id) res.status(400).send(ApiResponse.buildError("Not authorized"));

        const data = req.body;
        const newhardHabilities = data.hardHabilities || [];

        const oldResource = await Resource.findOne({ _id });
        const oldHardHabilities = oldResource.hardHabilities;

        Object.assign(oldResource, data);

        const newResource = await oldResource.save();

        const added = arrayDifference(newhardHabilities, oldHardHabilities);
        const removed = arrayDifference(oldHardHabilities, newhardHabilities);

        await HardHability.updateMany({ '_id': added}, { $addToSet: {resources: newResource._id }})
        await HardHability.updateMany({ '_id': removed}, { $pull: {resources: newResource._id }})

        res.status(200).send(ApiResponse.buildSuccess(true));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);

        res.status(500).send(ApiResponse.buildError(err));
    }
});

router.delete('/resources/:id', async (req:any, res) => {
    try {
        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');

        const _id = req.params.id;

        if (!_id) res.status(400).send(ApiResponse.buildError("Not authorized"));

        const resource = await Resource.findOne({_id});

        await resource.remove();

        await HardHability.updateMany({'_id': resource.hardHabilities}, { $pull: {resources: resource._id}});

        res.status(200).send(ApiResponse.buildSuccess(true));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);

        res.status(500).send(ApiResponse.buildError(err));
    }
})

export { router as resourcesRoutes }