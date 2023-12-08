import type { NextApiRequest, NextApiResponse } from 'next'
import {Prisma, User} from "@prisma/client";
import {ZodError} from "zod";
import * as auth from "@/shared/services/auth.service";

import {AuthValidator} from "@/app/login/auth-validator";


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method !== 'POST') {
            res.status(404);
            return;
        }
        const data = AuthValidator.parse(req.body);
        const  dto = await auth.login(data.email, data.password);
        res.status(200).json(dto)
    } catch (e: any) {
        if(e instanceof ZodError){
            const  result:{[key:string]: string } = {};
            e.issues.forEach((issue) => {
                result[issue.path[0]] = issue.message;
            });
            res.status(400).json({ errors: result});
        } else
            switch (e.message) {
                case "NOT_MATCH":
                    res.status(401).json({ errors: {custom:"wrong credentials"}});
                    break;
                case "USER_NOT_FOUND":
                    res.status(400).json({ errors: {email:" user with provided email not found"}});
                    break;
                default:
                    res.status(500).json({ errors: { ['general']: e.message}});
            }
    }
}
