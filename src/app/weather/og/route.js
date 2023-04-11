import { ImageResponse } from 'next/server'; // REQUIRES NEXT 13.3
import { WeatherHeader, DetailedWeather } from '../Components/server';
import dayjs from 'dayjs';

const dating = (
  <span
  style={{
    padding: '20px 0 0 50px',
    marginTop: 'auto',
    fontSize: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  }}
  >{dayjs().format('h:mm a dddd MMMM D')}</span>
)

export const runtime = 'experimental-edge';
 
export const size = { width: 1200, height: 630 }; // Optimized from https://iamturns.com/open-graph-image-size/

// Make sure the font exists in the specified path:
const font = fetch(new URL('../../../../assets/manrope-latin-400-normal.ttf', import.meta.url)).then(
  (res) => res.arrayBuffer(),
);

console.log(import.meta.url)

export async function GET(request) {
  const search = request.nextUrl.search;
  const params = Object.fromEntries(new URLSearchParams(search));

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
    }}
    >
        {header}
        {detail}
        {dating}
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