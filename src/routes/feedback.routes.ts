import * as express from "express";

import {Feedback, IFeedback} from "../models/feedback";
import { ApiResponse } from "../classes/api-response";
import { ObjectId } from "mongodb";

const router = express.Router();

/**
 * List paginated praises feedbacks
 */
 router.get('/feedback/to/:id', async ( req: any, res) => {
    try {
        const id:string = req.params.id;

        if (  !(req.user.isAdmin || id === req.user._id) ) return res.status(401).send('Not Authorized');

        const limit: number = +process.env.MAX_ITEMS_PER_PAGE;
        const offset: number = ((+req.query.page||1)-1)*limit;

        const query = {to: new ObjectId(id)};

        const count = await Feedback.count(query);
        const data = await Feedback.find(query)
            .populate('to')
            .populate('from')
            .sort({date:'desc'})
            .limit(limit)
            .skip(offset);

        res.status(200).send(ApiResponse.buildSuccess(data, count));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * List paginated praises feedbacks
 */
 router.get('/feedback/from/:id', async ( req: any, res) => {
    try {
        const id:string = req.params.id;

        if (  !(req.user.isAdmin || id === req.user._id) ) return res.status(401).send('Not Authorized');

        const limit: number = +process.env.MAX_ITEMS_PER_PAGE;
        const offset: number = ((+req.query.page||1)-1)*limit;

        const query = {from: new ObjectId(id)};

        const count = await Feedback.count(query);
        const data = await Feedback.find(query)
            .populate('to')
            .populate('from')
            .sort({date:'desc'})
            .limit(limit)
            .skip(offset);

        res.status(200).send(ApiResponse.buildSuccess(data, count));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * Create praise
 */
 router.post('/feedback/:id', async (req: any, res) => {
    try {
        const id:string = req.params.id;
        if ( !req.user.isAdmin ) return res.status(401).send('Not Authorized');

        const feedback: IFeedback = new Feedback(req.body);

        feedback.from = new ObjectId(req.user._id);
        feedback.to = new ObjectId(id);

        const result = await feedback.save();

        res.status(200).send(ApiResponse.buildSuccess(result));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        // console.log(err);

        res.status(500).send(ApiResponse.buildError(err.toString()));
    }
});

router.delete('/feedback/:id', async (req: any, res) => {
    try {
        const id:string = req.params.id;
        if ( !req.user.isAdmin ) return res.status(401).send('Not Authorized');

        const feedback = await Feedback.findById(id);

        if (feedback.from !== req.user._id) return res.status(401).send('Not Authorized');

        const result = await Feedback.findByIdAndDelete(id);

        res.status(200).send(ApiResponse.buildSuccess(result));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err.toString()));
    }
});

export { router as feedbackRoutes }