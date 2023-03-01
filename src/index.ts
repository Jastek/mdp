import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { oktaAuth } from './middleware/auth';
import { cachingUsers } from './middleware/caching-users';
import * as bodyParser from 'body-parser';
import mongoose from "mongoose";
import cors from "cors";
import { corsHeaders } from "./middleware/cors-headers";

import bearerTokenCreator = require('express-bearer-token');
const bearerToken = bearerTokenCreator();

import { baseRoutes } from './routes/base.routes';
import { peopleRoutes } from "./routes/people.routes";
import { positionsRoutes } from './routes/positions.routes';
import { chaptersRoutes } from './routes/chapters.routes';
import { teamsRoutes } from './routes/teams.routes';
import { utilsRoutes } from "./routes/utils.routes";
import { hardHabilitiesRoutes } from "./routes/hard-habilities.routes";
import { resourcesRoutes } from "./routes/resources.routes";
import { hardEvalRoutes } from './routes/hard-eval.routes';
import { sessionsRoutes } from './routes/session.routes';
import { feedbackRoutes } from "./routes/feedback.routes";

const port = process.env.PORT || process.env.SERVER_PORT;

// Initialize app
const app = express()
    .use( bodyParser.json() )
    .use( bearerToken )
    // cors
    .use( cors() )
    .use( corsHeaders )
    // autorizer okta
    .use( oktaAuth )
    .use( cachingUsers )
    // Routes
    .use( baseRoutes )
    .use( peopleRoutes )
    .use( positionsRoutes )
    .use( teamsRoutes )
    .use( chaptersRoutes )
    .use( utilsRoutes )
    .use( resourcesRoutes )
    .use( hardHabilitiesRoutes )
    .use( hardEvalRoutes )
    .use( sessionsRoutes )
    .use( feedbackRoutes );

// Initialize mongoose
const options: any = {
    // useCreateIndex: true,
    // useNewUrlParser: true,
    // useUnifiedTopology: true
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4
}

mongoose.connect(process.env.CONNECTION_STRING, options, (error)=>{
    if (!error) process.env.DBCONNECTED = 'true';
});


app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port} since ${new Date()}`);
})
