import { ImageResponse } from 'next/server'; // REQUIRES NEXT 13.3
import { WeatherHeader, DetailedWeather, OpenMeteoData, adjustedDayjsInstance } from '../Components/server';
import dayjs from 'dayjs';
const utc = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const advancedFormat = require('dayjs/plugin/advancedFormat')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(advancedFormat)

const dating = (timeZoneOffset=0, timeZoneName='', coordinates=[]) => {
  let offsetDirection = parseInt(timeZoneOffset) > 0 ? '+' : '-';

  const tzDate = new Date().toLocaleString('en-US', 'UTC');
  
  return (
  <div
    style={{
      display: 'flex',
      padding: '0px 70px 70px 70px',
      color: '#e5e0d7',
      marginTop: 'auto',
      fontSize: '25px',
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.0em'
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
      {dayjs().format('z')} {timeZoneName} {` \u00A0 | \u00A0 UTC ${offsetDirection}${dayjs().startOf('day').add(Math.abs(parseInt(timeZoneOffset)), 'minutes').format('HH:mm')}`}
    </span>
    </div>
  )
}

export const runtime = 'experimental-edge';
 
export const size = { width: 1200, height: 630 }; // Optimized from https://iamturns.com/open-graph-image-size/
export const contentType = 'image/png';
export const alt = `The current temperature and weather. Detailed forecast from the NWS.`;

// Make sure the font exists in the specified path:
const font = async (origin) => {
  console.log({origin})
  const manrope400Req = await fetch(`${origin}/manrope-latin-400-normal.ttf`);
  const manrope400ArrayBuffer = await manrope400Req.arrayBuffer();

  return {
    manrope400ArrayBuffer,
  }
}

export async function GET(request) {
  const search = request.nextUrl.search;
  const params = Object.fromEntries(new URLSearchParams(search));

  const dateElement = dating(params.offset, params.zone, [params.lat, params.lon])

  const { manrope400ArrayBuffer } = await font(request.nextUrl.origin);

  const startDate = adjustedDayjsInstance({
      timeZoneOffset: parseFloat(params.offset)
  }).format('YYYY-MM-DD');
  const endDate = adjustedDayjsInstance({
      timeZoneOffset: parseFloat(params.offset)
  }).add(15, 'days').format('YYYY-MM-DD');

  const masterWeatherData = OpenMeteoData('&current_weather=true', {
      startDate,
      endDate,
      latitude: params.lat,
      longitude: params.lon,
      units: params.units
  });

  const header = await WeatherHeader({
    latitude: params.lat,
    longitude: params.lon,
    city: params.city,
    units: params.units,
    timeZoneOffset: params.offset,
    og: true,
    req: masterWeatherData
  })
  
  console.log(header.props['data-gradient'])

  const detail = await DetailedWeather({
    latitude: params.lat,
    longitude: params.lon,
    og: true
  })

  const gradientElement = (
      <span
      style={
        {
            position: 'absolute',
            top: '0%',
            left: '0%',
            right: '0%',
            bottom: '0%',
            padding: "0px 0px 0px 0px",
            background: header.props['data-gradient'],
        }
      }></span>
  )
  const gradientElementCover = (
    <span
    style={
      {
          position: 'absolute',
          top: '0%',
          left: '0%',
          right: '0%',
          bottom: '0%',
          padding: "0px 0px 0px 0px",
          opacity: 0.3,
          background: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIj4NCiAgICA8ZmlsdGVyIGlkPSJub2lzZSIgeD0iMCIgeT0iMCI+DQogICAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPg0KICAgICAgPGZlQmxlbmQgbW9kZT0ic2NyZWVuIi8+DQogICAgPC9maWx0ZXI+DQogICAgPHJlY3Qgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjEiLz4NCjwvc3ZnPg==)',
      }
    }></span>
  )

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
        {gradientElement}
        {gradientElementCover}
        {header}
        {detail}
        {dateElement}
    </div>
  ), {
    ...size, 
    fonts: [          
      {
        name: 'Manrope',
        data: manrope400ArrayBuffer,
        weight: 400,
        style: 'normal',
      }
    ]
  }
  );
}