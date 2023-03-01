import { Request, Response, NextFunction } from 'express';
import { Person } from '../models/person';
import { params } from '../app.config';

/**
 * Identifies if a users has been cached, if not, then function
 * looks up by the user in db
 * @param req
 * @param res
 * @param next
 * @returns
 */
export async function cachingUsers(req:any, res:Response, next: NextFunction) {

    try {
        if (params.publicRoutes.indexOf(req.url) !== -1) {
            return next()
        };

        const userEmail = req.user.email;

        const users: any = req.app.locals.users||{}

        if (users?.[userEmail] === undefined) {
            const user = await Person
                .findOne({email: userEmail})
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

    } catch(err) {
        return res.status(500).send(err.message);
    }
}