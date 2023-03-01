import * as express from "express";
import {Session} from "../models/session";
import { ApiResponse } from "../classes/api-response";

import { formatSearch } from "../helpers/format-search";
import { formatOrder } from "../helpers/format-order";

const router = express.Router();

const params = {
    defaultColumn: 'date',
    defaultOrder: 'DESC',
    searchColumns:['to.firstName', 'to.lastName1', 'to.lastName2']
}

/**
 * List paginated
 */
router.get('/sessions', async ( req: any, res) => {
    try {
        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');

        const search = formatSearch(req.query.search, params.searchColumns);
        const order  = formatOrder(req.query.order_column||params.defaultColumn, req.query.order_direction||params.defaultOrder);

        const limit: number = +process.env.MAX_ITEMS_PER_PAGE;
        const offset: number = ((+req.query.page||1)-1)*limit;

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

        const data = await Session
            .aggregate(aggregate)
            .sort(order)
            .limit(limit)
            .skip(offset);

        let count:any = 0;

        if ((data||[]).length > 0) {
            count = await Session
                .aggregate(aggregate)
                .count('count');

            count = count[0].count;
        }

        res.status(200).send(ApiResponse.buildSuccess(data, count));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        res.status(500).send(ApiResponse.buildError(err));
    }
});


/**
 * Get by id
 */
router.get('/sessions/:id', async ( req: any, res) => {
    try {
        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');

        const id = req.params.id;

        if (!id) res.status(400).send(ApiResponse.buildError("Not authorized"));

        const data = await Session.findById(id).populate('to');

        res.status(200).send(ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * Create
 */
router.post('/sessions', async (req: any, res) => {
    try {
        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');

        const session = new Session(req.body);
        session.from = req.user._id;

        const result = await session.save();

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
 router.patch('/sessions/:id', async (req: any, res) => {
    try {
        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');

        const id = req.params.id;

        if (!id) res.status(400).send(ApiResponse.buildError("Not authorized"));

        const updateData = req.body;
        const result = await Session.findByIdAndUpdate(id, updateData);

        res.status(200).send(ApiResponse.buildSuccess(result));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);

        res.status(500).send(ApiResponse.buildError(err));
    }
});

// router.delete('/sessions/:id', async (req:any, res) => {
//     try {
//         if (!req.user.isAdmin) return res.status(401).send('Not Authorized');

//         const id = req.params.id;

//         if (!id) res.status(400).send(ApiResponse.buildError("Not authorized"));

//         const person = await Session.findByIdAndDelete(id);

//         res.status(200).send(ApiResponse.buildSuccess(person));
//     }
//     catch (err) {
//         // tslint:disable-next-line:no-console
//         console.log(err);

//         res.status(500).send(ApiResponse.buildError(err));
//     }
// })

export { router as sessionsRoutes }