import type {NextApiRequest, NextApiResponse} from 'next'
import {Prisma, User} from "@prisma/client";
import * as service from "@/shared/services/account.service"
import Decimal = Prisma.Decimal;
import {ZodError} from "zod";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {getAuthContext} from "@/shared/utils/get-auth-context";
import {UserRegValidator} from "@/app/sign-up/user-reg-validator";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method !== 'POST') {
            res.status(404);
            return;
        }
        const  authData = await getAuthContext(req);

        if(authData !== null) {
            const  {filter} = req.body;
            const result = await service.findUserAccounts(filter);
            if (result !== null) {
                res.status(200).json( result.map(({id, username, email, balance}) => ({id, username, email, balance})));
            } else {
                res.status(404);
            }
        } else {
            res.status(401);
        }
    } catch (e: any) {
        res.status(500).json({errors: {['general']: e.message}});

    }
}
