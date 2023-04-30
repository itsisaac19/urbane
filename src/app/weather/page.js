import styles from '../styles/weather.module.css';

import { WeatherHeader, DetailedWeather, WeatherTiles, Chart } from './Components/server';
import { ClockTiles, ReadableDate, Countdown, ChartTabs, Radar, ShareButton } from './Components/client';
import { Navbar } from "@/app/navbar/navbar";
import { Suspense } from 'react';
import Link from 'next/link';
import { manrope } from "../utils/fonts";

const dayjs = require('dayjs');

export default async function Home({ searchParams }) {

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
    <div className={`${styles['master-wrap']} ${manrope.className}`}>
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
                        <div className={`${styles['update-now-wrap']}`}>
                            <span className={`${styles['update-now-text']}`}>
                                Update now
                            </span> 
                            <svg className={`${styles['update-icon']}`} width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24.2744 12.5996H23.0439C22.5254 8.14355 18.6582 4.56641 14 4.56641C11.4248 4.56641 9.08688 5.69141 7.46969 7.44922C7.03903 7.87109 7.05661 8.43359 7.40817 8.75879C7.76852 9.09277 8.28708 9.09277 8.72653 8.68848C10.0361 7.27344 11.917 6.38574 14 6.38574C17.709 6.38574 20.706 9.10156 21.207 12.5996H19.8623C19.1855 12.5996 19.0009 13.1006 19.3965 13.6455L21.497 16.6162C21.8222 17.0557 22.3144 17.0645 22.6308 16.6162L24.7402 13.6543C25.1357 13.1006 24.9599 12.5996 24.2744 12.5996ZM3.72555 14.7178H4.96481C5.48337 19.1738 9.35055 22.751 14 22.751C16.5927 22.751 18.9306 21.6172 20.5478 19.8594C20.9697 19.4375 20.9521 18.875 20.6006 18.5498C20.2402 18.2158 19.7304 18.2158 19.2822 18.6289C17.9902 20.0439 16.1093 20.9316 14 20.9316C10.2998 20.9316 7.3027 18.2158 6.80173 14.7178H8.13766C8.80563 14.7178 8.99899 14.2168 8.60348 13.6719L6.49411 10.7012C6.1777 10.2617 5.68552 10.2529 5.36911 10.7012L3.25973 13.6631C2.85544 14.2168 3.04001 14.7178 3.72555 14.7178Z" />
                            </svg>
                        </div>
                        <div className={`${styles['share-link']}`}>
                            <ShareButton styles={styles}></ShareButton>
                            <svg className={`${styles['share-icon']}`}width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.46777 16.8623H7.10938C7.03906 16.3086 6.99512 15.7109 7.08301 15.1924H6.57324C4.48145 15.1924 2.99609 13.7246 2.99609 11.6152C2.99609 9.52344 4.48145 8.03809 6.57324 8.03809H14.334C16.4258 8.03809 17.9111 9.52344 17.9111 11.6152C17.9111 13.7246 16.4258 15.1924 14.334 15.1924H11.6445C11.2227 15.4736 11.2578 16.5283 11.8027 16.8623H14.4395C17.4893 16.8623 19.6689 14.709 19.6689 11.6152C19.6689 8.53027 17.4893 6.37695 14.4395 6.37695H6.46777C3.41797 6.37695 1.23828 8.53027 1.23828 11.6152C1.23828 14.709 3.41797 16.8623 6.46777 16.8623ZM13.5518 21.0195H21.5146C24.5732 21.0195 26.7529 18.8662 26.7529 15.7812C26.7529 12.6875 24.5732 10.5342 21.5146 10.5342H20.8818C20.9521 11.0879 20.9961 11.6855 20.9082 12.2041H21.418C23.5098 12.2041 24.9951 13.6719 24.9951 15.7812C24.9951 17.873 23.5098 19.3584 21.418 19.3584H13.6572C11.5654 19.3584 10.0801 17.873 10.0801 15.7812C10.0801 13.6719 11.5654 12.2041 13.6572 12.2041H16.3467C16.7686 11.9229 16.7334 10.8682 16.1885 10.5342H13.5518C10.4932 10.5342 8.32227 12.6875 8.32227 15.7812C8.32227 18.8662 10.4932 21.0195 13.5518 21.0195Z" />
</svg>
                     </div>
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
                                    <span className={`${styles['stats-tab']} ${styles['stats-24']} ${styles['active']}`} data-frame='24h'>24h</span>
                                    <span className={`${styles['stats-tab']} ${styles['stats-48']}`} data-frame='48h'>48h</span>
                                    <span className={`${styles['stats-tab']} ${styles['stats-72']}`} data-frame='72h'>72h</span>
                                    <span className={`${styles['stats-tab']} ${styles['stats-7-day']}`} data-frame='7d'>7 days</span>
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