import * as express from "express";
import { ApiResponse } from "../classes/api-response";

const router = express.Router();

// default home page
router.get('/', async ( req: any, res) => {
    try {
        res.send(ApiResponse.buildSuccess({
            message: `CSP MDP version ${process.env.VERSION}`,
            connected: process.env.DBCONNECTED,
            environment: process.env.NODE_ENV
        }));
    }
    catch (err) {
        res.status(500).send(ApiResponse.buildError(err));
    }
});

export { router as baseRoutes }