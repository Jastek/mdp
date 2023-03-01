import * as express from "express";
import {Chapter, IChapter} from "../models/chapter";
import { ApiResponse } from "../classes/api-response";
import { Person } from "../models/person";
import { formatSearch } from "../helpers/format-search";
import { formatOrder } from "../helpers/format-order";
import { ObjectId } from "mongodb";

const router = express.Router();

const params = {
    defaultColumn: 'name',
    defaultOrder: 'DESC',
    searchColumns:['name']
}

/**
 * List paginated
 */
router.get('/chapters', async ( req: any, res) => {
    try {
        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');

        const search = formatSearch(req.query.search, params.searchColumns);
        const order  = formatOrder(req.query.order_column||params.defaultColumn, req.query.order_direction||params.defaultOrder);

        const limit: number = +process.env.MAX_ITEMS_PER_PAGE;
        const offset: number = ((+req.query.page||1)-1)*limit;

        const count = await Chapter.count(search);
        const data = await Chapter.find(search).sort(order).limit(limit).skip(offset);

        res.status(200).send(ApiResponse.buildSuccess(data, count));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * List all paginated
 */
 router.get('/chapters/all', async ( req: any, res) => {
    try {
        const data = await Chapter.find({});

        res.status(200).send(ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * Get by id
 */
router.get('/chapters/:id', async ( req: any, res) => {
    try {
        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');

        const id = req.params.id;

        if (!id) res.status(400).send(ApiResponse.buildError("Not authorized"));

        const data = await Chapter.findById(id);

        res.status(200).send(ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * Get people who have finished this course
 */
 router.get('/chapters/:id/people', async ( req: any, res) => {
    try {
        const id = req.params.id;

        if (!id) res.status(400).send(ApiResponse.buildError("Not authorized"));

        // const data = await Resource.findById(id);
        const data = await Person.find({
            'chapter': new ObjectId(id)
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
router.post('/chapters', async (req: any, res) => {
    try {
        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');

        const chapter = new Chapter(req.body);
        const result = await chapter.save();

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
 router.patch('/chapters/:id', async (req: any, res) => {
    try {
        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');

        const id = req.params.id;

        if (!id) res.status(400).send(ApiResponse.buildError("Not authorized"));

        const updateData = req.body;
        const result = await Chapter.findByIdAndUpdate(id, updateData);

        res.status(200).send(ApiResponse.buildSuccess(result));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);

        res.status(500).send(ApiResponse.buildError(err));
    }
});

router.delete('/chapters/:id', async (req:any, res) => {
    try {
        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');

        const id = req.params.id;

        if (!id) res.status(400).send(ApiResponse.buildError("Not authorized"));

        const person = await Chapter.findByIdAndDelete(id);

        res.status(200).send(ApiResponse.buildSuccess(person));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);

        res.status(500).send(ApiResponse.buildError(err));
    }
})

export { router as chaptersRoutes }