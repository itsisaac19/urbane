import { ImageResponse } from 'next/server'; // REQUIRES NEXT 13.3

export const runtime = 'experimental-edge';
 
export const size = { width: 1200, height: 630 }; // Optimized from https://iamturns.com/open-graph-image-size/
export const contentType = 'image/png';


export async function GET(request) {
  const search = request.nextUrl.search;
  const params = Object.fromEntries(new URLSearchParams(search));



  //const radarSource = `https://opengeo.ncep.noaa.gov/geoserver/conus/conus_bref_qcd/ows?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=conus_bref_qcd&TIME=2023-04-21T01:58:06.000Z&STYLES=&FORMAT=image/png&TRANSPARENT=TRUE&HEIGHT=512&WIDTH=512&CRS=EPSG:3857${getBoundingBoxUrlParams(params.lat, params.lon)}`

  //console.log({radarSource})

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
        {/* <img width={512} height={512} src={radarSource}></img> */}
    </div>
  ), {
    ...size, 
  }
  );
}