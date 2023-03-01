"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const auth_1 = require("./middleware/auth");
const caching_users_1 = require("./middleware/caching-users");
const bodyParser = __importStar(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cors_headers_1 = require("./middleware/cors-headers");
const bearerTokenCreator = require("express-bearer-token");
const bearerToken = bearerTokenCreator();
const base_routes_1 = require("./routes/base.routes");
const people_routes_1 = require("./routes/people.routes");
const positions_routes_1 = require("./routes/positions.routes");
const chapters_routes_1 = require("./routes/chapters.routes");
const teams_routes_1 = require("./routes/teams.routes");
const utils_routes_1 = require("./routes/utils.routes");
const hard_habilities_routes_1 = require("./routes/hard-habilities.routes");
const resources_routes_1 = require("./routes/resources.routes");
const hard_eval_routes_1 = require("./routes/hard-eval.routes");
const session_routes_1 = require("./routes/session.routes");
const feedback_routes_1 = require("./routes/feedback.routes");
const port = process.env.PORT || process.env.SERVER_PORT;
// Initialize app
const app = (0, express_1.default)()
    .use(bodyParser.json())
    .use(bearerToken)
    // cors
    .use((0, cors_1.default)())
    .use(cors_headers_1.corsHeaders)
    // autorizer okta
    .use(auth_1.oktaAuth)
    .use(caching_users_1.cachingUsers)
    // Routes
    .use(base_routes_1.baseRoutes)
    .use(people_routes_1.peopleRoutes)
    .use(positions_routes_1.positionsRoutes)
    .use(teams_routes_1.teamsRoutes)
    .use(chapters_routes_1.chaptersRoutes)
    .use(utils_routes_1.utilsRoutes)
    .use(resources_routes_1.resourcesRoutes)
    .use(hard_habilities_routes_1.hardHabilitiesRoutes)
    .use(hard_eval_routes_1.hardEvalRoutes)
    .use(session_routes_1.sessionsRoutes)
    .use(feedback_routes_1.feedbackRoutes);
// Initialize mongoose
const options = {
    // useCreateIndex: true,
    // useNewUrlParser: true,
    // useUnifiedTopology: true
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4
};
mongoose_1.default.connect(process.env.CONNECTION_STRING, options, (error) => {
    if (!error)
        process.env.DBCONNECTED = 'true';
});
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port} since ${new Date()}`);
});
//# sourceMappingURL=index.js.map