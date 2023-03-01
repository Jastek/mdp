import * as express from "express";
import {HardEvaluation, IHardEvaluation} from "../models/hard-evaluation";
import { ApiResponse } from "../classes/api-response";

const router = express.Router();

/**
 * List paginated
 */
router.get('/hard-evaluations', async ( req: any, res) => {
    try {
        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');

        const limit: number = +process.env.MAX_ITEMS_PER_PAGE;
        const offset: number = ((+req.query.page||1)-1)*limit;

        const count = await HardEvaluation.count({});
        const data = await HardEvaluation.find({}).populate('person').limit(limit).skip(offset);

        res.status(200).send(ApiResponse.buildSuccess(data, count));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * Get by id
 */
 router.get('/hard-evaluations/:id', async ( req: any, res) => {
    try {
        const id = req.params.id;

        if (!id) res.status(401).send(ApiResponse.buildError("Not authorized"));

        const data = await HardEvaluation.findById(id);

        res.status(200).send(ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * List all paginated from a person
 */
 router.get('/hard-evaluations/:id/list', async ( req: any, res) => {
    try {
        const id:string = req.params.id;

        if (  !(req.user.isAdmin || id === req.user._id) ) return res.status(401).send('Not Authorized');

        const limit: number = +process.env.MAX_ITEMS_PER_PAGE;
        const offset: number = ((+req.query.page||1)-1)*limit;

        const count = await HardEvaluation.count({person: id});
        const data = await HardEvaluation
            .find({person: id})
            .sort({ date: 'desc'})
            .limit(limit).skip(offset);

        res.status(200).send(ApiResponse.buildSuccess(data, count));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

/**
 * Create
 */
router.post('/hard-evaluations', async (req: any, res) => {
    try {
        const hardEvaluation = new HardEvaluation(req.body);
        hardEvaluation.person = req.user._id;
        hardEvaluation.date = new Date();

        const result = await hardEvaluation.save();

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
 router.patch('/hard-evaluations/:id', async (req: any, res) => {
    try {
        const id = req.params.id;

        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');
        if (!id) res.status(400).send(ApiResponse.buildError("Not authorized"));

        const updateData = req.body;
        const result = await HardEvaluation.findByIdAndUpdate(id, updateData);

        res.status(200).send(ApiResponse.buildSuccess(result));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);

        res.status(500).send(ApiResponse.buildError(err));
    }
});

router.delete('/hard-evaluations/:id', async (req:any, res) => {
    try {
        const id = req.params.id;

        if (!req.user.isAdmin) return res.status(401).send('Not Authorized');

        const hardEvaluation = await HardEvaluation.findByIdAndDelete(id);

        res.status(200).send(ApiResponse.buildSuccess(hardEvaluation));
    }
    catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err);

        res.status(500).send(ApiResponse.buildError(err));
    }
})

export { router as hardEvalRoutes }