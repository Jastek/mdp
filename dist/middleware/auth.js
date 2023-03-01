"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.oktaAuth = void 0;
const person_1 = require("../models/person");
const jwt_verifier_1 = __importDefault(require("@okta/jwt-verifier"));
const app_config_1 = require("../app.config");
function oktaAuth(req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (app_config_1.params.publicRoutes.indexOf(req.url) !== -1)
                return next();
            if (!req.headers.authorization)
                throw new Error('Not Authorized');
            const accessToken = (_b = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.trim()) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
            if (!accessToken)
                return res.status(401).send('No token - Not Authorized');
            const verifier = new jwt_verifier_1.default({
                issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`
            });
            let tokenResult;
            try {
                tokenResult = yield verifier.verifyAccessToken(accessToken, 'api://default');
            }
            catch (err) {
                throw new Error('Bad token - Not Authorized');
            }
            const user = yield person_1.Person
                .findOne({ email: tokenResult.claims.sub })
                .select('_id email isAdmin firstName lastName1');
            if (!user)
                throw new Error('No user found - Not authorized');
            // @ts-ignore
            req.user = {
                email: tokenResult.claims.sub,
                isAdmin: tokenResult.claims.isAdmin,
            };
            next();
        }
        catch (err) {
            return res.status(401).send(err.message);
            // tslint:disable-next-line:no-console
            // console.log(err);
        }
    });
}
exports.oktaAuth = oktaAuth;
//# sourceMappingURL=auth.js.map