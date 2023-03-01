// import * as express from "express";
// import { ApiResponse } from "../classes/api-response";
// import {Person, IPerson, IAssignedResource, AssignedResource} from "../models/person";
// import { formatSearch } from "../helpers/format-search";
// import { formatOrder } from "../helpers/format-order";
// import { ObjectId } from "mongodb";
// import { authenticate } from "ldap-authentication";
// const router = express.Router();
// const params = {
//     defaultColumn: 'name',
//     defaultOrder: 'DESC',
//     searchColumns:['name']
// }
// /**
//  * List paginated
//  */
// router.get('/auth/login', async ( req: any, res) => {
//     let result;
//         let user;
//         try {
//             user = await Person
//                 .findOne({email: req.user.email})
//                 .populate('reportsTo');
//             let authenticated = await authenticate
//             result = await entity.login(req.body.username, req.body.password);
//             if (null == result) {
//                 user.errorLogin = (user.errorLogin||0)+1;
//                 if (user.errorLogin >= config.maxWrongLogins)
//                     user.status = 'blocked';
//                 await user.save();
//                 return res.status(401).send(new response(null, 401, messages.unAuthorized));
//             }
//             if (user.errorLogin > 0){
//                 user.errorLogin = 0;
//             }
//             user.lastLogin = new Date();
//             user.save();
//             return res.status(200).send(new response(result, 200));
//         } catch (err) {
//             res.status(500).send(new response(null, 500, messages.error));
//         }
// });
// export { router as positionsRoutes }
//# sourceMappingURL=auth.routes.js.map