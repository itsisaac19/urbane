'use client';

import { createRef, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import styles from '../styles/Home.module.css';
var ReactDOM = require('react-dom/client');

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Link from 'next/link';
dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 
 * @param {Object} props 
 * @param {StylesObject} props.styles 
 * 
 * @returns 
 */

let detectedRoot;

export const DetectCurrentButton = (props) => {
    const router = useRouter();
    const detectRef = createRef();
    const [detectedText, setDetectedText] = useState('');
    const [detectedCoords, setDetectedCoords] = useState([null, null]);
    const [detectedURL, setDetectedURL] = useState('');

    const reverseGeocode = async (lat, lon) => {
        const reverseCall = await fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=BWVZN4WKKL2J&format=json&by=position&lat=${lat}&lng=${lon}`)
        const reverseResponse = await reverseCall.json();

        console.log({reverseResponse});

        if (reverseResponse.zoneName) {
            setDetectedCoords([lat.toFixed(3), lon.toFixed(3)])
            setDetectedText(reverseResponse.cityName)
            setDetectedURL(`/weather?lat=${lat}&lon=${lon}&city=${reverseResponse.cityName}&zone=${reverseResponse.zoneName}&offset=${(reverseResponse.gmtOffset / 60)}&units=${reverseResponse.countryCode == 'US' ? 'imperial' : 'metric'}`)
        }
    }

    const detectLocation = async () => {
        const success = async (pos) => {
            const crd = pos.coords;
        
            console.log("Your current position is:");
            console.log(`Latitude : ${crd.latitude}`);
            console.log(`Longitude: ${crd.longitude}`);
            console.log(`More or less ${crd.accuracy} meters.`);

            reverseGeocode(crd.latitude, crd.longitude)
        }

        const error = (err) => {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        navigator.geolocation.getCurrentPosition(success, error, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        });
    }

    useEffect(() => {
        detectRef.current.addEventListener('click', detectLocation)
    }, [])

    return (
        <>
    <button ref={detectRef} className={styles['detect-button']}>Detect my current location</button>
    <button type="button" className={`${styles['detected-button']} ${detectedText.length > 1 ? styles['show'] : ''}`} onClick={() => router.push(detectedURL)}>
        <div className={styles['detected-text']}>{detectedText}</div>
        <div className={styles['detected-coords']}>{`${detectedCoords[0]}, ${detectedCoords[1]}`}</div>
        <div className={styles['detected-arrow']}>GO →</div>
    </button>
    </>
    );
}

/**
 * 
 * @param {DefaultProps} props 
 */
export const SearchInput = (props) => {
    const searchRef = createRef();

    let gridRoot;

    const geocodeSearchString = async (locationSearchString) => {
        if (locationSearchString.length < 3) {
            return;
        }

        const geocodeReq = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${locationSearchString}&count=5&language=en&format=json`);
        const geocodeData = await geocodeReq.json();

        console.log({geocodeData});
        const resultsJSX = HandleGeocodeResponse(geocodeData);

        const SearchResultGrid = document.querySelector(`.${styles['search-results-grid']}`);
        gridRoot = gridRoot || ReactDOM.createRoot(SearchResultGrid);
        gridRoot.render(resultsJSX);
    }

    useEffect(() => {
        let isTypingTimeout;
        
        searchRef.current.addEventListener('input', (e) => {
            if (isTypingTimeout) {
                clearTimeout(isTypingTimeout);
            }

            const input = e.currentTarget;
            const locationSearchString = input.value;

            isTypingTimeout = setTimeout(() => {
                geocodeSearchString(locationSearchString)
            }, 300)
        })
    })

    return (<input ref={searchRef} className={styles['search-input']} type="text" placeholder={'Enter a city to get started'} />);
}


/**
* Renders a search result component.
* @param {OpenMeteoGeocodeResponse} result - The search result object.
* 
* @returns {JSX.Element} The rendered search result component.
*/
export const SearchResult = (result) => {
    const text = `${result.name}, ${result.country}`;
    const coords = [result.latitude, result.longitude];
    const id = result.id;

    let lowestHierarchicalArea = result.name;

   /*  if (result.admin4) {
        lowestHierarchicalArea = result.admin4;
    } else if (result.admin3) {
        lowestHierarchicalArea = result.admin3;
    } else if (result.admin2) {
        lowestHierarchicalArea = result.admin2;
    } else if (result.admin1) {
        lowestHierarchicalArea = result.admin1;
    } else {
        console.error('no `lowestHierarchicalArea`')
    } */

    const timeZoneOffset = dayjs().tz(result.timezone).utcOffset();

    const hrefString = `/weather?lat=${coords[0]}&lon=${coords[1]}&city=${lowestHierarchicalArea}&zone=${result.timezone}&offset=${timeZoneOffset}&units=${result.country_code == 'US' ? 'imperial' : 'metric'}`

    return (
        <Link key={id} className={styles['search-result']} href={hrefString}>
            <span className={styles['result-text']}>{text}</span>
            <span className={styles['result-coords']}>{coords[0].toFixed(3)}, {coords[1].toFixed(3)}</span>
        </Link>
    )
}



/**
 * 
 * @param {Object} response 
 * @param {number} response.generationtime_ms
 * @param {Array<OpenMeteoGeocodeResponse>} response.results 
 *  
 * @returns {Array<JSX.Element>} The rendered search results as an array.
 */
export const HandleGeocodeResponse = (response) => {
    const results = response.results.map(result => SearchResult(result));

    return results;
}