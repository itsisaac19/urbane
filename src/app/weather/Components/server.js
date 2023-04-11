import { nanoid } from 'nanoid'

import React from "react";
import dayjs from 'dayjs';

import { TilesWrapper } from './client';

export const GreetingText = () => {
    const hours = new Date().getHours();
    let greeting = 'WELCOME. ';

    if (hours >= 5 && hours < 12) {
        greeting = 'GOOD MORNING. ';
    } else if (hours >= 12 && hours < 17) {
        greeting = 'GOOD AFTERNOON. ';
    } else if (hours >= 17 && hours < 24 || hours >= 0 && hours < 5) {
        greeting = 'GOOD EVENING. ';
    }  

    return greeting;
}

const parseWeatherCode = (code) => {
    let weather = '';
    switch (code) {
        case 0:
            weather = 'Clear skies'
            break;
        case 1:
            weather = 'Mostly Clear'
            break;
        case 2:
            weather = 'Partly cloudy'
            break;
        case 3:
            weather = 'Overcast'
            break;
        case 45:
            weather = 'Foggy'
            break;
        case 48:
            weather = 'Foggy' // `depositing rime fog` ??
            break;
        case 51:
            weather = 'Light Drizzle'
            break;
        case 53:
            weather = 'Moderate Drizzle'
            break;
        case 55:
            weather = 'Dense Drizzle'
            break;
        case 56:
            weather = 'Freezing Drizzle'
            break;
        case 57:
            weather = 'Freezing Drizzle'
            break;
        case 61:
            weather = 'Light Rain'
            break;
        case 63:
            weather = 'Moderate Rain'
            break;
        case 65:
            weather = 'Heavy Rain'
            break;
        case 66:
            weather = 'Light Freezing Rain'
            break;
        case 67:
            weather = 'Heavy Freezing Rain'
            break;
        case 71:
            weather = 'Light Snow'
            break;
        case 73:
            weather = 'Moderate Snow'
            break;
        case 75:
            weather = 'Heavy Snow'
            break;
        case 77:
            weather = 'Snow grains'
            break;
        case 80:
            weather = 'Light rain showers'
            break;
        case 81:
            weather = 'Moderate Rain Showers'
            break;
        case 82:
            weather = 'Violent Rain showers'
            break;
        case 85:
            weather = 'Light Snow Showers'
            break;
        case 86:
            weather = 'Heavy Snow Showers'
            break;
        case 95:
            weather = 'Thunderstorms'
            break;
        case 96:
            weather = 'Thunderstorms with slight hail'
            break;
        case 99:
            weather = 'Thunderstorms with heavy hail'
            break;

        default:
            weather = ''
            break;
    }

    return weather;
}

export const WeatherHeader = async ({latitude, longitude, city, units='metric', styles, og=false}) => {
    const startDate = dayjs().format('YYYY-MM-DD');
    const endDate = startDate;

    console.time('only current')

    const openMeteoData = await OpenMeteoData('&current_weather=true', {
        startDate,
        endDate,
        latitude,
        longitude,
        units
    })

    console.timeEnd('only current');

    //console.log('open-meteo:', openMeteoData);

    const currentTemp = Math.round(openMeteoData.current_weather.temperature);
    const currentWeather = parseWeatherCode(openMeteoData.current_weather.weathercode);

    if (og === true) {
        return (
            <span style={
                {
                    maxWidth: '1100px',
                    color: '#1B1B1B',
                    fontWeight:"400",
                    fontSize: "95px", 
                    textTransform: "none", 
                    letterSpacing: '-0.03em',
                    lineHeight: "95px",
                    padding: "50px"
                }
            }>It's {currentTemp}{units == 'metric' ? '°C' : '°F'} and {currentWeather} in {city}.</span> 
        )  
    }

    return (
        <>
        <span className={`${styles['greeting']}`}>{GreetingText()}</span> 
        <span className={`${styles['filler']}`}>IT'S </span> 
        <span className={`${styles['weather-info']}`}><span className={units}>{currentTemp}</span> <span className={`${styles['filler']}`}> AND </span> {currentWeather}</span> 
        <span className={`${styles['filler']}`}> IN </span> 
        <span className={`${styles['weather-info']}`}>{city}.</span>
        </>
    )
}

const degreesTo16Wind = (degrees, readable) => {
    const cardinalDirections = [
        "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
        "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
    ];
    
    const degreeStep = 22.5;
    const index = Math.floor((degrees + degreeStep / 2) / degreeStep) % 16;
    return cardinalDirections[index];
}

export const OpenMeteoData = async (customParamString='', props={
    startDate: '',
    endDate: '',
    latitude: 0,
    longitude: 0,
    units: ''
}) => {
    const startAndEnd = `&start_date=${props.startDate}&end_date=${props.endDate}`;
    
    let unitString = '';
    if (props.units == 'imperial') {
        unitString = `&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch`
    }
    
    const openMeteoRequest = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${props.latitude}&longitude=${props.longitude}${unitString}${customParamString}${startAndEnd}&timezone=auto`, { cache: 'no-store' });

    return openMeteoRequest.json();
}

const betterLabels = {
    time: 'Time',

    // Hourly
    temperature_2m: "Measured Temperature",
    relativehumidity_2m: "Relative Humidity",
    dewpoint_2m: "Dew Point",
    apparent_temperature: "Apparent Temperature",
    precipitation_probability: "Chance of Rain",
    precipitation: "Precipitation",
    rain: "Rain",
    showers: "Showers",
    snowfall: "Snowfall",
    snow_depth: "Snow Depth",
    weathercode: "Weather Code",
    surface_pressure: "Surface Pressure",
    cloudcover: "Cloud Cover",
    visibility: "Visibility",
    windspeed_10m: "Wind Speed",
    windspeed_80m: "Wind Speed at 80m",
    winddirection_10m: "Wind Direction",
    winddirection_80m: "Wind Direction at 80m",
    windgusts_10m: "Wind Gusts",

    // Daily
    temperature_2m_max: 'Max Temperature',
    temperature_2m_min: 'Min Temperature',
    apparent_temperature_max: 'Max Apparent Temperature',
    apparent_temperature_min: 'Min Apparent Temperature',
    sunrise: 'Sunrise',
    sunset: 'Sunset',
    uv_index_max: 'Max UV Index',
    precipitation_sum: 'Total Precipitation',
    rain_sum: 'Total Rain',
    showers_sum: 'Total Showers',
    snowfall_sum: 'Total Snowfall',
    precipitation_hours: 'Precipitation Hours',
    precipitation_probability_max: 'Max Precipitation Probability',
    windspeed_10m_max: 'Max Wind Speed',
    windgusts_10m_max: 'Max Wind Gusts',
    winddirection_10m_dominant: 'Dominant Wind Direction'
};

export const WeatherTiles = async ({latitude, longitude, city, units='metric', precision=true, styles}) => {

    const startDate = dayjs().format('YYYY-MM-DD');
    const endDate = startDate;


    const openMeteoData = await OpenMeteoData('&hourly=temperature_2m,apparent_temperature,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weathercode,surface_pressure,cloudcover,visibility,windspeed_10m,winddirection_10m,windgusts_10m&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant', {
        startDate,
        endDate,
        latitude,
        longitude,
        units
    })

    console.log('hourly 0 day')

    const [hourlyWeather, hourlyUnits] = [openMeteoData.hourly, openMeteoData.hourly_units];
    const [dailyWeather, dailyUnits] = [openMeteoData.daily, openMeteoData.daily_units];


    const generateTile = (label, value) => {
        return (
            <div id={nanoid()} data-label={label} draggable="true" className={`${styles['tile-item']} ${styles['']}`}>
                <span className={`${styles['tile-value']}`}>{value}</span>
                <span className={`${styles['tile-label']}`}>{label}</span>
            </div>
        )
    }

    const cleanUnit = (unit) => {
        let clean = unit;

        if (clean.match('iso8601')) return '';

        if (clean.match('mp/h')) return ' mph';
        
        if (clean.match('inch')) clean = 'in.';

        if (clean.match('°|%')) {

        } else {
            clean = ` ${clean}`
        }

        return clean;
    }

    const pinnedTilesChildren = [];
    const allTilesChildren = [];

    let currentTime = dayjs().format('YYYY-MM-DDTHH:00');
    let timeIndex = hourlyWeather.time.indexOf(currentTime);
    //console.log({timeIndex, currentTime})

    const hourlyAndDailyWeather = Object.assign({}, hourlyWeather, dailyWeather);
    const hourlyAndDailyUnits = Object.assign({}, hourlyUnits, dailyUnits);

    for (let weatherVariable in hourlyAndDailyWeather) {
        if (weatherVariable.match('time|weathercode')) continue;

        const data = hourlyAndDailyWeather[weatherVariable];
        let displayLabel = betterLabels[weatherVariable];


        let displayValue = data[0];

        if (data.length > 1) { // hourly
            displayValue = data[timeIndex];
        }

        if (displayValue % 1 != 0) {
            if (precision == false) {
                displayValue = Math.round(displayValue)
            }
        }


        const FadedTextSpan = (text) => {
            return (
                <span className={styles['faded-text']}>{text}</span>
            )
        };
        let fadedText;

        if (displayLabel.match('Visibility')) displayValue = Math.round(displayValue);

        if (displayLabel.match('Sunrise|Sunset')) {
            let hourChar = (units == 'metric') ? 'H' : 'h';
            displayValue = dayjs(displayValue).format(`${hourChar}:mm A`) 
        };

        if (displayLabel.match('Direction')) {
            fadedText = ` ${degreesTo16Wind(displayValue)}`;
        };
        
        let unit = hourlyAndDailyUnits[weatherVariable] ?? '';
        if (unit) {
            unit = cleanUnit(unit);
        }


        displayValue = (
            <>
            {`${displayValue}${unit}`}
            {fadedText ? FadedTextSpan(fadedText) : null}
            </>
        );

        //console.log(displayValue);

        allTilesChildren.push(generateTile(displayLabel, displayValue))
    }



    return (
        <TilesWrapper styles={styles}>{allTilesChildren}</TilesWrapper>
    )
}

const prioritizeNumberInformation = (str) => {
    return str.replace(/\d+/g, (number) => {
        return `<u>${number}</u>`;
    });
}


export const DetailedWeather = async ({latitude, longitude, og}) => {
    const nwsRequest = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`, { cache: 'no-store' });
    const nwsData = await nwsRequest.json();
  
    const nwsForecastRequest = await fetch(nwsData.properties.forecast, { cache: 'no-cache' });
    const nwsForecastData = await nwsForecastRequest.json();
  
    //console.log('got it', nwsForecastData.properties.periods[0].detailedForecast);

    if (!nwsForecastData?.properties) console.log(nwsForecastData);
    const detailedForecast = nwsForecastData.properties.periods[0].detailedForecast;
    const priorityString = prioritizeNumberInformation(detailedForecast)

/*     const windSpeed = [5, 6, 7, 8, 9, 10];
    const temperature = [66, 65, 65, 67, 68, 68];
    const humidity = [60, 61, 62, 63, 64, 65];
    const rainChance = [0, 0, 0, 100, 100, 0];

    const willOrWillBe = windSpeed[0] === 0 ? "will be" : "will";

    // Check if maximum rain chance is above 50%
    const maxRainChance = Math.max(...rainChance);
    const hasRain = maxRainChance > 50;

    const windSum = windSpeed.reduce((a, b) => a + b, 0)
    const windAvg = windSum / windSpeed.length;

    // Construct weather statement
    let weatherStatement = `Wind around ${Math.round(windAvg)} mph, with a high near ${Math.max(...temperature)}.`;

    if (hasRain) {
    // Determine the index of the start and end of the rain period
    const rainStart = dayjs().add(rainChance.indexOf(maxRainChance), 'hours').format('h:00a');
    const rainEnd = dayjs().add(rainChance.lastIndexOf(maxRainChance), 'hours').format('h:00a');

    // Calculate the duration of the rain period
    const rainDuration = rainChance.lastIndexOf(maxRainChance) - rainChance.indexOf(maxRainChance) + 1;

    // Add rain information to weather statement
    weatherStatement += ` ${maxRainChance}% chance of rain for ${rainDuration} hours, starting at ${rainStart}.`;
    } else {
    // Add dry weather information to weather statement
    const dailyRainChance = 0;
    weatherStatement += ` Chance of precipitation is ${dailyRainChance}%.`;
    }

    console.log({weatherStatement}); */

    if (og === true) {
        return (
            <span
            style={{
                maxWidth: '1050px',
                height: '200px',
                overflow: 'hidden',
                fontSize: '40px',
                color: '#1B1B1B',
                margin: '10px 50px 0'
            }}
            >{detailedForecast}</span>
        )
    }

    return detailedForecast;
}


import { ChartElement } from './client';

export const Chart = async ({latitude, longitude, city, units='metric', styles}) => {
    const startDate = dayjs().format('YYYY-MM-DD');
    const endDate = startDate;


    const openMeteoData = await OpenMeteoData('&hourly=temperature_2m,apparent_temperature,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,snow_depth,weathercode,surface_pressure,cloudcover,visibility,windspeed_10m,winddirection_10m,windgusts_10m&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,precipitation_probability_max,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant', {
        startDate,
        endDate,
        latitude,
        longitude,
        units
    })

    const hourlyWeather = openMeteoData.hourly;
    let currentTime = dayjs().format('YYYY-MM-DDTHH:00');
    let timeIndex = hourlyWeather.time.indexOf(currentTime);

    const datasets = {};

    for (let weatherVariable in hourlyWeather) {
        if (weatherVariable.match('time|weathercode')) continue;

        const data = hourlyWeather[weatherVariable];
        const label = betterLabels[weatherVariable];

        const dataset = {
            label,
            data,
            borderWidth: 6,
            tension: 0.4,
        }

        datasets[label] = (dataset)
    }
    
    
    return (
        <ChartElement 
            weatherDatasets={datasets}
            styles={styles}
            timeIndex={timeIndex}
        ></ChartElement>
    )
}

