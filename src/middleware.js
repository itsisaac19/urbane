import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';


export function middleware(request) {
    const search = request.nextUrl.search;
    const params = Object.fromEntries(new URLSearchParams(search));
    console.log({params});

    const response = NextResponse.next();

    if (params.lat && params.lon) {
        const coordinates = {
            lat: params.lat,
            lon: params.lon,
        }
    
        response.cookies.set('coordinates', JSON.stringify(coordinates))
    }

    if (params.city) {
        const city = params.city;
        response.cookies.set('city', city) 
    }
    
    return response;
}



export const config = {
    matcher: '/weather',
}