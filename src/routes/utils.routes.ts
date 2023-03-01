import * as express from "express";
import { Team } from "../models/team";
import { Position } from "../models/position";
import { Chapter } from '../models/chapter';
import { Person } from "../models/person";
import { ApiResponse } from "../classes/api-response";
import { HardHability } from "../models/hard-habilities";
import { Resource } from "../models/resource";

const router = express.Router();

/**
 * People forms data for combos
 */
router.get('/utils/forms/people', async ( req: any, res) => {
    try {
        const data: any = {};

        data.positions = await Position.find({}).sort({order: 'asc'})
        data.teams = await Team.find({}).sort({name: 'desc'});
        data.chapters = await Chapter.find({}).sort({name: 'desc'});
        data.admins = await Person.find({isAdmin: true}).sort({name: 'desc'});

        res.status(200).send(ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

router.get('/utils/lists/hard-habilities', async ( req: any, res) => {
    try {
        const data: any = {};

        data.positions = await Position.find({}).sort({order: 'asc'});
        data.teams = await Team.find({}).sort({name: 'desc'});
        data.chapters = await Chapter.find({}).sort({name: 'desc'});

        res.status(200).send(ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

router.get('/utils/forms/hard-habilities', async ( req: any, res) => {
    try {
        const data: any = {};

        data.positions = await Position.find({}).sort({order: 'asc'});
        data.teams = await Team.find({}).sort({name: 'desc'});
        data.chapters = await Chapter.find({}).sort({name: 'desc'});
        data.resources = await Resource.find({}).sort({name: 'desc'});

        res.status(200).send(ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

router.get('/utils/forms/resources', async ( req: any, res) => {
    try {
        const data: any = {};

        data.people = await Person.find({}).sort({lastName1: 'desc'});
        data.hardHabilities = await HardHability.find({}).sort({name: 'desc'});

        res.status(200).send(ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

router.get('/utils/forms/hard-evaluation', async ( req: any, res) => {
    try {
        const data: any = {};
        data.hardHabilities = await HardHability.find({}).sort({category: 'asc', name: 'asc'});

        res.status(200).send(ApiResponse.buildSuccess(data));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});


export { router as utilsRoutes }