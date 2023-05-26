import { NextRequest, NextResponse } from 'next/server';

// This function can be marked `async` if using `await` inside
/**
 * 
 * @param {NextRequest} request 
 * @returns 
 */
export function middleware(request) {
    let newURL = new URL(request.nextUrl.origin);

    const defaultLocation = {
        "status": "OK",
        "message": "",
        "countryCode": "US",
        "countryName": "United States",
        "regionName": "Minnesota",
        "cityName": "Minneapolis",
        "zoneName": "America\/Chicago",
        "abbreviation": "CDT",
        "gmtOffset": -18000,
        "dst": "1",
        "zoneStart": 1678608000,
        "zoneEnd": 1699167600,
        "nextAbbreviation": "CST",
        "timestamp": 1685047453,
        "formatted": "2023-05-25 20:44:13"
    }

    if (request.nextUrl.pathname.startsWith('/')) {
        if (request.nextUrl.pathname.startsWith('/weather') || request.nextUrl.pathname.startsWith('/radar')) {
            let searchParams = request.nextUrl.searchParams;    
            if (!(searchParams.get('lat') && searchParams.get('lon') && searchParams.get('units') && searchParams.get('city') && searchParams.get('offset'))) {
                return NextResponse.redirect(`http://localhost:3000${request.nextUrl.pathname}?lat=44.97997&lon=-93.26384&city=Minneapolis&zone=America/Chicago&offset=-300&units=imperial`);
            }
        } else {
            if (request.geo.latitude && request.geo.longitude) {
                newURL.searchParams.append('lat', request.geo.latitude)
                newURL.searchParams.append('lon', request.geo.longitude)
            }
            return NextResponse.rewrite(newURL, request.nextUrl.origin);
        }
    } 



    console.log(newURL.toString())

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/', '/weather', '/radar'],
};