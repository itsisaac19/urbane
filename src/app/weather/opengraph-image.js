import { ImageResponse } from 'next/server'; // REQUIRES NEXT 13.3
import fs from 'fs';

const publicString = process?.env?.BUILD == 'true' || process?.env?.DEV == 'true' ? './public' : '' 
console.log({
  DEV: process?.env?.DEV,
  BUILD: process?.env?.BUILD
})


console.log(fs.readdirSync('/'));
console.log(fs.readdirSync('./'));
console.log(fs.readdirSync(process.cwd()));
console.log(process.cwd());
const manropeArrayBuffer = fs.readFileSync(`${publicString}/manrope-latin-400-normal.ttf`)



import styles from '../styles/weather.module.css';
import { WeatherHeader, DetailedWeather } from './Components/server';
import { cookies } from 'next/headers';

export const size = { width: 1200, height: 630 }; // Optimized from https://iamturns.com/open-graph-image-size/
export const alt = 'URBANE Weather';
export const contentType = 'image/png';

export default async function og({req}) {

  const cookieStore = cookies();
  const cookieCoordinates = cookieStore.get('coordinates');

  let coordinates;
  let cityIsCoords = false;

  let units = cookieStore.get('units')?.value || 'metric'
  let city = cookieStore.get('city')?.value 

  if (cookieCoordinates) {
    coordinates = JSON.parse(cookieCoordinates.value)
    console.log('coords found in cookie:', {coordinates})
  } else {
    const ipReq = await fetch('http://ip-api.com/json/');
    const ipResponse = await ipReq.json();
    coordinates = {
      lat: ipResponse.lat,
      lon: ipResponse.lon
    }

    city = ipResponse.city;

    console.log('coords found via IP:', {coordinates})
  }

  if (!city) {
    city = `at ${coordinates.lat}, ${coordinates.lon}`
    cityIsCoords = true;
  }


  const header = await WeatherHeader({
    latitude: coordinates.lat,
    longitude: coordinates.lon,
    city: city,
    units: units,
    styles: styles,
    cityIsCoords: cityIsCoords,
    og: true
  })

  const detail = await DetailedWeather({
    latitude: coordinates.lat,
    longitude: coordinates.lon,
    og: true
  })

  return new ImageResponse(( 
    <div
    style={{
      display: 'flex', 
      flexDirection: 'column'
    }}
    >
        {header}
        {detail}
    </div>
  ), {
    ...size, 
    fonts: [          
      {
        name: 'Manrope',
        data: manropeArrayBuffer,
        weight: 500,
        style: 'normal',
      }
    ]
  }
  );
  // ...
} 