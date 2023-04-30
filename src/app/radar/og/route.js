import { ImageResponse } from 'next/server'; // REQUIRES NEXT 13.3
import proj4 from 'proj4';

function getBoundingBoxUrlParams(lat, lon) {
  console.log({lat, lon})
  // Define the size of the bbox in EPSG:3857
  const bboxSize = 111319.49079327358 * 1000; // Example bbox size in meters

  // Define the source and target coordinate reference systems
  const fromProjection = "EPSG:4326"; // WGS84
  const toProjection = "EPSG:3857";

  // Convert the lat and lon to EPSG:3857
  const coords3857 = proj4(fromProjection, toProjection, [lon, lat]);

  // Calculate the bbox coordinates in EPSG:3857
  const bbox3857 = [
    coords3857[0] - bboxSize, // west
    coords3857[1] - bboxSize, // south
    coords3857[0] + bboxSize, // east
    coords3857[1] + bboxSize  // north
  ];

  // Convert the bbox coordinates back to EPSG:4326
  const bbox = proj4(toProjection, fromProjection, bbox3857).join(",");

  // Construct the URL parameter string representing the bounding box
  const bbox_params = `&BBOX=${bbox}`;

  return bbox_params;
}

export const runtime = 'experimental-edge';
 
export const size = { width: 1200, height: 630 }; // Optimized from https://iamturns.com/open-graph-image-size/
export const contentType = 'image/png';


export async function GET(request) {
  const search = request.nextUrl.search;
  const params = Object.fromEntries(new URLSearchParams(search));

  const radarSource = `https://opengeo.ncep.noaa.gov/geoserver/conus/conus_bref_qcd/ows?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=conus_bref_qcd&TIME=2023-04-21T01:58:06.000Z&STYLES=&FORMAT=image/png&TRANSPARENT=TRUE&HEIGHT=512&WIDTH=512&CRS=EPSG:3857${getBoundingBoxUrlParams(params.lat, params.lon)}`

  console.log({radarSource})

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
        <img width={512} height={512} src={radarSource}></img>
    </div>
  ), {
    ...size, 
  }
  );
}