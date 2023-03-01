import * as express from "express";
import {HardHability} from "../models/hard-habilities";
import { Resource } from "../models/resource";
import { ApiResponse } from "../classes/api-response";
import { arrayDifference } from '../helpers/array-difference';

import { formatSearch } from "../helpers/format-search";
import { formatOrder } from "../helpers/format-order";
import { ObjectId } from "mongodb";
import { identity } from "lodash";

const router = express.Router();

const params = {
    defaultColumn: 'category',
    defaultOrder: 'DESC',
    searchColumns:['category', 'name']
}

/**
 * List paginated
 */
router.get('/hard-habilities', async ( req: any, res) => {
    try {
        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');

        const search = formatSearch(req.query.search, params.searchColumns);
        const order  = formatOrder(req.query.order_column||params.defaultColumn, req.query.order_direction||params.defaultOrder);

        const limit: number = +process.env.MAX_ITEMS_PER_PAGE;
        const offset: number = ((+req.query.page||1)-1)*limit;

        const count = await HardHability.count(search);
        const data = await HardHability.find(search).sort(order).limit(limit).skip(offset);

        res.status(200).send(ApiResponse.buildSuccess(data, count));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * List all paginated
 */
 router.get('/hard-habilities/all', async ( req: any, res) => {
    try {
        const data = await HardHability.find({}).sort({category: 'desc', name: 'desc'});;

        res.status(200).send(ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * Get by id
 */
router.get('/hard-habilities/:id', async ( req: any, res) => {
    try {
        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');

        const id = req.params.id;

        if (!id) res.status(400).send(ApiResponse.buildError("Not authorized"));

        const data = await HardHability.findById(id);

        res.status(200).send(ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * Create
 */
router.post('/hard-habilities', async (req: any, res) => {
    try {
        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');

        const hardHability = new HardHability(req.body);
        let result:any = await hardHability.save();

        result = await Resource.updateMany({'_id': hardHability.resources}, { $addToSet: { 'hardHabilities': hardHability._id} });

        res.status(200).send(ApiResponse.buildSuccess(result));
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
 router.patch('/hard-habilities/:id', async (req: any, res) => {
    try {
        const _id = req.params.id;

        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');
        if (!_id) res.status(400).send(ApiResponse.buildError("Not authorized"));

        // const updateData = req.body;
        // const result = await HardHability.findByIdAndUpdate(id, updateData);

        const data = req.body;
        const newResources = data.resources || [];

        const oldHardHability = await HardHability.findOne({ _id });
        const oldResources = oldHardHability.resources;

        Object.assign(oldHardHability, data);

        const newHardHability = await oldHardHability.save();

        const added = arrayDifference(newResources, oldResources);
        const removed = arrayDifference(oldResources, newResources);

        await Resource.updateMany({ '_id': added}, { $addToSet: {hardHabilities: newHardHability._id }})
        await Resource.updateMany({ '_id': removed}, { $pull: {hardHabilities: newHardHability._id }})

        res.status(200).send(ApiResponse.buildSuccess(true));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);

        res.status(500).send(ApiResponse.buildError(err));
    }
});

router.delete('/hard-habilities/:id', async (req:any, res) => {
    try {
        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');
        const _id = req.params.id;

        if (!_id) res.status(400).send(ApiResponse.buildError("Not authorized"));

        const hardHability = await HardHability.findOne({_id});

        await hardHability.remove();

        await Resource.updateMany({ '_id': hardHability.resources}, { $pull: { hardHabilities: hardHability._id }});

        res.status(200).send(ApiResponse.buildSuccess(true));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);

        res.status(500).send(ApiResponse.buildError(err));
    }
})

router.patch('/hard-habilities/:id/edit-ponderation', async (req:any, res) => {
    try {
        const id = req.params.id;

        if ( !(req.user.isAdmin) ) return res.status(401).send('Not Authorized');

        const hardHability:any = await HardHability.findById(id);

        if (!hardHability) return res.status(400).send(ApiResponse.buildError("Not authorized"));

        const idEntity = req.body._id;

        const fieldName: 'chapter'|'position' = req.body.fieldName;
        const arrayName: string = fieldName + 'Ponds';
        const fullField = fieldName + "Ponds.$.ponderation";
        const idField = arrayName+'.'+fieldName;

        const updateQuery: any = { _id: new ObjectId(id) };
        const update: any = {};

        if (hardHability[arrayName].find((x:any) => x[fieldName].toString() === idEntity)){
            updateQuery[idField] = new ObjectId(idEntity);
            update[fullField] = req.body.ponderation;

            await HardHability.updateOne(updateQuery, { $set: update });
        } else {
            const ponderation:any = {};
            ponderation[fieldName] = new ObjectId(idEntity);
            ponderation.ponderation = req.body.ponderation;

            update[arrayName] = ponderation;

            await HardHability.updateOne(updateQuery, { $addToSet: update });
        }

        res.status(200).send(ApiResponse.buildSuccess(true));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);

        res.status(500).send(ApiResponse.buildError(err.toString()));
    }
})

export { router as hardHabilitiesRoutes }