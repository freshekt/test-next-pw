'use server'

import * as service from "@/shared/services/account.service";
import {Prisma} from ".prisma/client";
import {ZodError} from "zod";
import {redirect} from 'next/navigation';
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import {UserRegValidator} from "@/app/sign-up/user-reg-validator";
import Decimal = Prisma.Decimal;


export async function register(formData: FormData) {
    const data = UserRegValidator.parse(Object.fromEntries(formData));
    try {

        await service.create({
            username: data.username,
            email: data.email,
            password: data.password,
            balance: Decimal.ceil(200),
        });

        redirect('/login');
    } catch (e) {
        console.log(e);
        if (e instanceof ZodError) {
            const result: { [key: string]: string } = {};
            e.issues.forEach((issue) => {
                result[issue.path[0]] = issue.message;
            });
            return result;
        } else if (e instanceof PrismaClientKnownRequestError) {
            switch (e.code) {
                case "P2002":
                    const key = e.meta ? e.meta.target[0] : "";
                    // @ts-ignore
                    return {[key]: (`${data[key]} is busy`)};
                default:
                    return  {['general']:e.message};
            }
        } else {
            throw e;
        }
    }


}


