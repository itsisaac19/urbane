

import styles from '../styles/radar.module.css';

import { Navbar } from "@/app/navbar/navbar";
import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import { CurrentTimer, Radar } from './Components/client';

const dayjs = require('dayjs');

export default async function Home({ searchParams }) {

    console.log({searchParams})

    if (!(searchParams.lat && searchParams.lon && searchParams.units && searchParams.city && searchParams.offset)) {
        //redirect('/');
    }

    const coordinates = [searchParams.lat, searchParams.lon];
    const city = searchParams.city;
    const units = searchParams.units;

	const lastReqTime = dayjs().toISOString();

  return (
    <div className={styles['master-wrap']}>
        {Navbar(searchParams, 'radar')}
        <div className={styles['master-grid']}>
            <div className={`${styles['sub-grid-1']} `}>
                <Radar
                    latitude={coordinates[0]}
                    longitude={coordinates[1]}
                    city={city}
                    units={units}
                    styles={styles}
                />
                <div className={`${styles['controls']}`}>
                    <div className={`${styles['controls-grid']}`}>
                        <div className={`${styles['controls-layers']}`}>
                            <div className={`${styles['control-layer-category-column']}`}>
                                <div className={`${styles['category-radars']}`}>
                                    <div className={`${styles['radar-item']} ${styles['base-radar']}`}>
                                        <div className={`${styles['item-label']}`}>Base Radar QC</div>
                                        <div className={`${styles['item-dot']}`}></div>
                                    </div> 
                                    <div className={`${styles['radar-item']} ${styles['disable']}`}>
                                        <div className={`${styles['item-label']}`}>Composite Radar QC</div>
                                        <div className={`${styles['item-dot']}`}></div>
                                    </div> 
                                    <div className={`${styles['radar-item']} ${styles['disable']}`}>
                                        <div className={`${styles['item-label']}`}>Precipitation Type</div>
                                        <div className={`${styles['item-dot']}`}></div>
                                    </div> 
                                </div>
                                <div className={`${styles['category-tile']}`}>
                                    <div className={`${styles['category-tile-title']}`}>
                                        NOAA Radars
                                    </div>
                                    <div className={`${styles['category-tile-description']}`}>
                                        National Oceanic and Atmospheric Administration
                                    </div>
                                </div>
                            </div>
                            <div className={`${styles['control-layer-category-column']}`}>
                                <div className={`${styles['category-radars']}`}>
                                    <div className={`${styles['radar-item']} ${styles['disable']}`}>
                                        <div className={`${styles['item-label']} `}>Rain Viewer Global Radar</div>
                                        <div className={`${styles['item-dot']}`}></div>
                                    </div> 
                                </div>
                                <div className={`${styles['category-tile']}`}>
                                    <div className={`${styles['category-tile-title']}`}>
                                        Rain Viewer Radar
                                    </div>
                                    <div className={`${styles['category-tile-description']}`}>
                                        {`Accurate short-term rain forecast (coming soon)`}{/*  */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`${styles['controls-slider']} ${styles['waiting']}`}>
                            <div className={`${styles['loader-grid']}`}>

                            </div>

                            <div className={`${styles['slider-grid']}`}>
                                <div className={`${styles['slider-start']}`}>---:--- ---</div>
                                <div className={`${styles['slider-wrap']}`}>
                                    <input 
                                    className={`${styles['slider-range']} ${styles['disable']}`}
                                    type={'range'}
                                    min={0}
                                    max={14}
                                    defaultValue={0}
                                    ></input>
                                    <div className={`${styles['map-time-tooltip']}`}>---:--- ---</div>
                                </div>
                                <div className={`${styles['slider-end']}`}>---:--- ---</div>
                            </div>
                        </div>
                        <div className={`${styles['controls-time']}`}>
                            <div className={`${styles['map-time-tile']}`}>
                                <span className={`${styles['map-time-text']}`}>MAP TIME</span>
                                <span className={`${styles['map-time-value']}`}>---:--- ---</span>
                            </div>
                            <div className={`${styles['current-time-tile']}`}>
                                <span className={`${styles['current-time-text']}`}>CURRENT TIME</span>
                                <span className={`${styles['current-time-value']}`}>
                                    <CurrentTimer 
                                        styles={styles}
                                    ></CurrentTimer>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}



export async function generateMetadata(req) {
    const params = req.searchParams;

    const weatherLocation = params.city;
	// If (!params)

    const host = process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : 'https://urbaneweather.vercel.app'

	return { 
		title: `Weather for ${weatherLocation} | URBANE`, 
		description: 'Welcome to Urbane Weather',
        openGraph: {
            title: `Current Weather Conditions for ${weatherLocation} | Urbane`,
            description: `The current temperature and weather. Detailed forecast from the NWS.`,
            images: [{
                url: `${host}/weather/og?lat=${params.lat}&lon=${params.lon}&units=${params.units}&city=${params.city}&offset=${params.offset}&zone=${params.zone}`,
                width: 1200,
                height: 630,
            }]
        }
	}
  }