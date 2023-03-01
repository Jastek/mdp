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
Object.defineProperty(exports, "__esModule", { value: true });
exports.cachingUsers = void 0;
const person_1 = require("../models/person");
const app_config_1 = require("../app.config");
/**
 * Identifies if a users has been cached, if not, then function
 * looks up by the user in db
 * @param req
 * @param res
 * @param next
 * @returns
 */
function cachingUsers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (app_config_1.params.publicRoutes.indexOf(req.url) !== -1) {
                return next();
            }
            ;
            const userEmail = req.user.email;
            const users = req.app.locals.users || {};
            if ((users === null || users === void 0 ? void 0 : users[userEmail]) === undefined) {
                const user = yield person_1.Person
                    .findOne({ email: userEmail })
                    .select('_id email');
                users[userEmail] = {
                    _id: user._id.toString(),
                    isAdmin: req.user.isAdmin
                };
                req.app.locals.users = users;
            }
            req.user.isAdmin = users[userEmail].isAdmin;
            req.user._id = users[userEmail]._id;
            next();
        }
        catch (err) {
            return res.status(500).send(err.message);
        }
    });
}
exports.cachingUsers = cachingUsers;
//# sourceMappingURL=caching-users.js.map