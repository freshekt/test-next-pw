'use server'
import * as service from "@/shared/services/account.service";
import {TokenDto} from "@/shared/models/token.dto";
import {NextRequest} from "next/server";
import * as jwt from 'jose'
import {User} from "@prisma/client";

const comparePassword = function (plainPass: string, hashword: string, callback: (err: any, isPasswordMatch?: boolean) => any) {
    const bcrypt = require('bcryptjs');
    bcrypt.compare(plainPass, hashword, function (err: any, isPasswordMatch: boolean) {
        return err == null ?
            callback(null, isPasswordMatch) :
            callback(err);
    });
};

export type AuthPayload = {
    userId: number;
    username: string
}

export async function login(email: string, password: string) {
    return new Promise<TokenDto>(async (resolve, reject) => {
        const user = await service.getByEmail(email);
        if (user !== null) {
            comparePassword(password, user.password, async function (err: any, isPasswordMatch?: boolean) {
                if (err) {
                    reject(err);
                }

                if (isPasswordMatch) {
                        try {
                            const result = await  signIn(user);
                            resolve(result);
                        } catch (e) {
                            reject(e);
                        }
                } else {
                    reject(new Error("NOT_MATCH"));
                }

            });
        } else {
            reject(new Error("USER_NOT_FOUND"));
        }
    });

}

export async function isAuthenticated(request: NextRequest) {
    const cookie = request.cookies.get('tokenData');
    if (cookie !== undefined) {
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET,
        )
        const model = JSON.parse(cookie?.value) as TokenDto;

        const data = await jwt.jwtVerify(model.accessToken, secret);
        return data.payload;
    }
    const authorization = request.headers.get('authorization')?.split(' ')[1].trim();
    if (typeof authorization === 'string') {
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET,
        );
        const data = await jwt.jwtVerify(authorization, secret);
        return data.payload;
    }
    return false;
}

export async function signIn(user: User) {
    const secret = new TextEncoder().encode(
        process.env.JWT_SECRET,
    );
    const alg = 'HS256'

    const token = await new jwt.SignJWT({userId: user.id, username: user.username})
        .setProtectedHeader({alg})
        .sign(secret);

    return ({accessToken: token, username: user.username, userId: user.id});

}
