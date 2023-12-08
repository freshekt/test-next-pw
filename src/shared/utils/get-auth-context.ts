import type {NextApiRequest} from "next";
import * as jwt from "jose";
import {AuthPayload} from "@/shared/services/auth.service";

export async  function getAuthContext(req: NextApiRequest):Promise<AuthPayload | null>{
    const token = req.headers.authorization?.replace("Bearer ","");
    if(token !== undefined){
        const secret = new TextEncoder().encode(
            process.env.JWT_SECRET,
        );
        const data = await jwt.jwtVerify(token, secret);
        return data.payload as AuthPayload;
    } else  {
        return null;
    }
}
