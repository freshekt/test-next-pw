'use server'
import type {NextApiRequest, NextApiResponse} from 'next'
import {Prisma, User} from "@prisma/client";
import * as service from "@/shared/services/account.service"
import Decimal = Prisma.Decimal;
import {ZodError} from "zod";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {signIn} from "@/shared/services/auth.service";
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
        const user: Partial<User> = req.body;
        const data = UserRegValidator.parse({...user, confirmPassword: user.password });

        const newuser = await service.create({
            username: data.username,
            email: data.email,
            password: data.password,
            balance: Decimal.ceil(200),
        });
        var result = await  signIn(newuser);
        res.status(200).json(result)
    } catch (e) {
        if (e instanceof ZodError) {
            const result: { [key: string]: string } = {};
            e.issues.forEach((issue) => {
                result[issue.path[0]] = issue.message;
            });
            res.status(400).json({errors: result});
        } else if (e instanceof PrismaClientKnownRequestError) {
            switch (e.code) {
                case "P2002":
                    const key = e.meta ? (e.meta.target as Array<String>)[0] : "";
                    // @ts-ignore
                    const result = {[key]: (`A user with that ${key} already exists`)};
                    res.status(400).json({errors: result});
                    break;
                default:
                    res.status(500).json({errors: {['general']: e.message}});
            }
        }

    }
}
