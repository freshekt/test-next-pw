'use server'
import * as auth from "@/shared/services/auth.service";
import {ZodError,} from "zod";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {AuthValidator} from "@/app/login/auth-validator";


export  async  function login(e: any, form: FormData) {

    try {
        const data = AuthValidator.parse(Object.fromEntries(form));
        const  dto = await auth.login(data.email, data.password);
        cookies().set('tokenData', JSON.stringify(dto));

        redirect('/dashboard');
    } catch (e: any) {
        if(e instanceof ZodError){
            const  result:{[key:string]: string } = {};
             e.issues.forEach((issue) => {
               result[issue.path[0]] = issue.message;
            });
             return result;
        } else
        switch (e.message) {
            case "NOT_MATCH":
                return  {custom:"wrong credentials"};
            case "USER_NOT_FOUND":
                return  {email:" user with provided email not found"};
            default:
                throw e;
        }
    }

}




