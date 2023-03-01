import { Request, Response, NextFunction } from 'express';
import Axios from "axios";
import qs from 'qs';
import { Person } from '../models/person';
import { OktaAuth, AuthStateManager, Token, TokenManager, AccessToken } from '@okta/okta-auth-js';
import OktaJwtVerifier from '@okta/jwt-verifier';
import { params} from '../app.config';


export async function oktaAuth(req:Request, res:Response, next: NextFunction) {
    try {
        if (params.publicRoutes.indexOf(req.url) !== -1) return next();

        if (!req.headers.authorization) throw new Error('Not Authorized');

        const accessToken = (req.headers.authorization as string)?.trim()?.split(' ')[1];

        if (!accessToken) return res.status(401).send('No token - Not Authorized');

        const verifier = new OktaJwtVerifier({
            issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`
        });

        let tokenResult;

        try {
            tokenResult = await verifier.verifyAccessToken(accessToken, 'api://default');

        } catch ( err ) {
            throw new Error('Bad token - Not Authorized');
        }

        const user = await Person
            .findOne({email: tokenResult.claims.sub})
            .select('_id email isAdmin firstName lastName1');

        if (!user) throw new Error('No user found - Not authorized');

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
}