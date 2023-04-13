import { ImageResponse } from 'next/server'; // REQUIRES NEXT 13.3
import { WeatherHeader, DetailedWeather } from '../Components/server';
import dayjs from 'dayjs';
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const advancedFormat = require('dayjs/plugin/advancedFormat')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)

const dating = (timeZoneOffset=0, timeZoneName='') => {
  let offsetDirection = parseInt(timeZoneOffset) > 0 ? '+' : '-';

  const tzDate = new Date().toLocaleString('en-US', 'UTC');

  console.log('hello', tzDate)
  
  return (
  <div
    style={{
      display: 'flex',
      padding: '0px 50px 50px 50px',
      marginTop: 'auto',
      fontSize: '20px',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }}
  >
  <span
    style={{

    }}
    >{dayjs().utcOffset(parseInt(timeZoneOffset)).format('h:mm a dddd MMMM D')}</span>
    <span
    style={{
      marginLeft: 'auto'
    }}>
      {dayjs().format('z')} {timeZoneName} {` |  UTC ${offsetDirection}${dayjs().startOf('day').add(Math.abs(parseInt(timeZoneOffset)), 'minutes').format('HH:mm')}`}
    </span>
    </div>
  )
}

export const runtime = 'experimental-edge';
 
export const size = { width: 1200, height: 630 }; // Optimized from https://iamturns.com/open-graph-image-size/
export const contentType = 'image/png';
export const alt = `The current temperature and weather. Detailed forecast from the NWS.`;

// Make sure the font exists in the specified path:
const font = fetch(new URL('../../../../assets/manrope-latin-400-normal.ttf', import.meta.url)).then(
  (res) => res.arrayBuffer(),
);

console.log(import.meta.url)


export async function GET(request) {
  const search = request.nextUrl.search;
  const params = Object.fromEntries(new URLSearchParams(search));

  console.log(params.offset)

  const dateElement = dating(params.offset, params.zone)

  const manropeArrayBuffer = await font;

  const header = await WeatherHeader({
    latitude: params.lat,
    longitude: params.lon,
    city: params.city,
    units: params.units,
    og: true
  })

  const detail = await DetailedWeather({
    latitude: params.lat,
    longitude: params.lon,
    og: true
  })

  return new ImageResponse(( 
    <div
    style={{
      display: 'flex', 
      flexDirection: 'column',
      flex: '1',
      background: '#f6f6f6',
      height: '100%'
    }}
    >
        {header}
        {detail}
        {dateElement}
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
}