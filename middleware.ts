import { NextRequest } from 'next/server';
import {isAuthenticated} from "@/shared/services/auth.service";
export const config = {
    matcher: ['/dashboard','/dashboard/page']
}

export async function middleware(request: NextRequest) {
    // Call our authentication function to check the request
    console.log(request);
    if (! await isAuthenticated(request)) {
        // Respond with JSON indicating an error message
        return Response.json(
            { success: false, message: 'authentication failed' },
            { status: 401 }
        )
    }
}
