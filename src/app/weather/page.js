import styles from '../styles/weather.module.css';

import { WeatherHeader, DetailedWeather, WeatherTiles, Chart } from './Components/server';
import { ClockTiles, ReadableDate, Countdown, ChartTabs, Radar, ShareButton } from './Components/client';
import { Navbar } from "@/app/navbar/navbar";
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const dayjs = require('dayjs');

export default async function Home({ searchParams }) {
    const cookieStore = cookies();

    console.log({searchParams})
    const navSearchParams = new URLSearchParams(searchParams).toString();

    if (!(searchParams.lat && searchParams.lon && searchParams.units && searchParams.city && searchParams.offset)) {
        //redirect('/');
    }

    const coordinates = [searchParams.lat, searchParams.lon];
    const city = searchParams.city;
    const units = searchParams.units;

	const lastReqTime = dayjs().toISOString();

  return (
    <div className={styles['master-wrap']}>
        {Navbar(searchParams, 'home')}
        <div className={styles['master-grid']}>
            <div className={`${styles['sub-grid-1']} ${styles['temp-fixed']}`}>
                <div className={`${styles['grid-card']} ${styles['header']}`}>
                    <div className={`${styles['weather-header']}`}>
						<Suspense fallback={<div>IT'S ___________ AND _____________ IN ____________</div>}>
                        	<WeatherHeader
								latitude={coordinates[0]}
								longitude={coordinates[1]}
								city={city}
								units={units}
								styles={styles}
							/>
						</Suspense>
						
                    </div>

                    <div className={`${styles['weather-details']}`}>
                        <div className={`${styles['weather-details-value']}`}>
							<Suspense fallback={<div>Loading detailed weather description ...</div>}>
								<DetailedWeather
									latitude={coordinates[0]}
									longitude={coordinates[1]}
								/>
							</Suspense>  
                        </div> 
                    </div>

                    <div className={`${styles['weather-updates']}`}>
                        <span className={`${styles['updated']}`}>
                            <span className={`${styles['filler']}`}>Updated </span> 
                            <span className={`${styles['last-time']} ${styles['time-value']}`}>{dayjs().format('HH:mm:ss')}</span> 
                        </span> 
                        <span className={`${styles['next-update']}`}>
                            <span className={`${styles['filler']}`}>Next update </span> 
                            <span className={`${styles['countdown']} ${styles['time-value']}`}><Countdown lastReqTime={lastReqTime}/></span> 
                        </span> 
                        <span className={`${styles['update-now-text']}`}>Update now</span> 
                    </div>

                    <div className={`${styles['share-link']}`}>
                        <ShareButton styles={styles}></ShareButton>
                        <svg className={`${styles['share-icon']}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" ><path d="M30.3 13.7L25 8.4l-5.3 5.3-1.4-1.4L25 5.6l6.7 6.7z"/><path d="M24 7h2v21h-2z"/><path d="M35 40H15c-1.7 0-3-1.3-3-3V19c0-1.7 1.3-3 3-3h7v2h-7c-.6 0-1 .4-1 1v18c0 .6.4 1 1 1h20c.6 0 1-.4 1-1V19c0-.6-.4-1-1-1h-7v-2h7c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3z"/></svg>
                    </div>
                </div>

                <div className={`${styles['grid-card']} ${styles['clock']}`}>
                    <ClockTiles styles={styles}/>
                    <div className={`${styles['date']}`}>
                        <span className={`${styles['readable-date-value']}`}>
							<ReadableDate/>
						</span>
                    </div>
                </div>

                <div className={`${styles['grid-card']} ${styles['mini-radar']}`}>
                    <div className={`${styles['banner']}`}>
                        <span className={`${styles['banner-text']} ${styles['time-sens']}`}>CURRENT RAIN RADAR</span> 
                        <span></span>
                        <Link href={`/radar?${navSearchParams}`} className={`${styles['banner-text']} ${styles['go-to']}`}>GO TO RADAR →</Link> 
                    </div>
                    <div className={`${styles['radar-wrap']}`}>
                        <Suspense fallback={<div>Loading radar ...</div>}>
                            <Radar
                                latitude={coordinates[0]}
                                longitude={coordinates[1]}
                                city={city}
                                units={units}
                                styles={styles}
                            />
                        </Suspense>
                    </div>
                    <div className={`${styles['temporal-footer']}`}>
                        <span className={`${styles['temporal-footer-value']}`}>Light rain expected around 2PM, then stopping at 3PM, then starting again until 6PM.</span>
                    </div>
                </div>
            </div>

            <div className={styles['sub-grid-2']}>
                <div className={`${styles['grid-card']} ${styles['tiles']}`}>
					<Suspense>
						<WeatherTiles
							latitude={coordinates[0]}
							longitude={coordinates[1]}
							city={city}
							units={units}
							styles={styles}
						/>
					</Suspense>
                    <div className={`${styles['tile-explain-wrapper']} ${styles['hide']}`}>
                        <div className={`${styles['tile-explain']}`}>
                            <span className={`${styles['explain-overline']}`}>INFORMATION</span>
                            <span className={`${styles['explain-label']}`}>Surface Pressure</span>
                            <span className={`${styles['explain-content']}`}>blah blah</span>
                            <div className={`${styles['explain-graphs-wrap']} explain-graphs-wrap`}>
                                <div className={`${styles['explain-analysis-text']}`}>{`There will be low until , and then will spike in  hours.`}</div>
                            </div>
                            <button className={`${styles['explain-close']} explain-close-btn`}>close</button>
                        </div>
                    </div>
                </div>

                <div className={`${styles['grid-card']} ${styles['analyze']}`}>
                    <div className={`${styles['analyze-grid']}`}>
                        <ChartTabs
                            styles={styles}
                        />

                        <div className={`${styles['analyze-graph']}`}>
                            <div className={`${styles['analyze-graph-wrap']}`}>
                                <Suspense>
									<Chart
										latitude={coordinates[0]}
										longitude={coordinates[1]}
										city={city}
										units={units}
										styles={styles}
									></Chart>
								</Suspense>
                            </div>
                        </div>
                        <div className={`${styles['analyze-stats']}`}>
                            <div className={`${styles['stats-tab-bar']}`}>
                                <div className={`${styles['stats-tabs-grid']}`}>
                                    <span className={`${styles['stats-tab']} ${styles['stats-24']} ${styles['active']}`}>24h</span>
                                    <span className={`${styles['stats-tab']} ${styles['stats-48']}`}>48h</span>
                                    <span className={`${styles['stats-tab']} ${styles['stats-72']}`}>72h</span>
                                    <span className={`${styles['stats-tab']} ${styles['stats-7-day']}`}>7 days</span>
                                </div>
                            </div>
 
                            <div className={`${styles['stats-list']}`}>
                                {/* examples */}
                                <div className={`${styles['stat-item']}`}>
                                    <span className={`${styles['stat-filler']}`}>Tomorrow will have a </span>
                                    <span className={`${styles['stat-cool']}`}>cooler </span>
                                    <span className={`${styles['stat-filler']}`}>high temperature, and a </span>
                                    <span className={`${styles['stat-cool']}`}>cooler </span>
                                    <span className={`${styles['stat-filler']}`}>low temperature than today.</span>
                                </div>
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