import {NextRequest, NextResponse} from 'next/server';
import {isAuthenticated} from "@/shared/services/auth.service";
export const config = {
    matcher: ['/dashboard','/dashboard/page','/api/protected/user-info','/api/protected/transactions','/api/protected/users/list']
}

export async function middleware(request: NextRequest) {
    // Call our authentication function to check the request
    console.log(request);
    if (!await isAuthenticated(request)) {
        // Respond with JSON indicating an error message
        if( config.matcher.some( s=> request.url.indexOf(s) == -1)) {
            return Response.json(
                {success: false, message: 'authentication failed'},
                {status: 401}
            );
        }else
            return NextResponse.redirect(new URL('/login', request.url));
    }
    return  NextResponse.next();
}
