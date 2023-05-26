import React from "react";

import dayjs, { Dayjs } from 'dayjs';
import { nanoid } from 'nanoid';
import { TilesWrapper, ChartElement, HeaderGradient } from './client';
import { generateTemperatureGradient } from "@/app/utils/colors";

/**
 * @typedef {Object} DefaultPropsTemplate
 * @property {Promise} req - The function call request. May be resolved depending on timing.
 * @property {number} latitude - The latitude of the location.
 * @property {number} longitude - The longitude of the location.
 * @property {string} city - The name of the city.
 * @property {string} [units='metric'] - The unit system to use for the temperature (default: 'metric').
 * @property {boolean} [precision=true] - Whether to show the precision of the temperature (default: true).
 * @property {number} [timeZoneOffset] - The time zone offset in minutes.
 * @property {Object} [styles] - An object containing custom styles for the component.
 * @property {boolean} [og=false] - Whether or not to engage the OpenGraph styles 
*/

/**
 * @typedef {Object} AdjustedDayjsOptions
 * @property {string} dateString - A parseable date string
 * @property {Object} instance - A dayjs instance
 * @property {number} timeZoneOffset - The time zone offset in minutes.
 * 
 * @param {AdjustedDayjsOptions} options
 * @returns {Dayjs} dayjs() instance with adjusted the timezone
 */
export const adjustedDayjsInstance = (options) => {
  if (options.dateString) {
    return dayjs(options.dateString).utcOffset(options.timeZoneOffset)
  }

  if (options.instance) {
    return dayjs(options.instance).utcOffset(options.timeZoneOffset)
  }

  //console.log('offset:', dayjs().utcOffset(options.timeZoneOffset))

  return dayjs().utcOffset(options.timeZoneOffset)
};


const Manager = {
  req: null,
  res: null
};

/**
 * @typedef {Object} OpenMeteoProps
 * @property {string} startDate
 * @property {string} endDate
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} units
 * @property {boolean} latch
 * 
 * @param {OpenMeteoProps} props
*/
export const OpenMeteoData = async (customParamString='', props) => {
    if (props.latch) {

    }

    const startAndEnd = `&start_date=${props.startDate}&end_date=${props.endDate}`;
    
    let unitString = '';
    if (props.units == 'imperial') {
        unitString = `&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch`
    }
    
    const reqString = `https://api.open-meteo.com/v1/forecast?latitude=${props.latitude}&longitude=${props.longitude}${unitString}${customParamString}${startAndEnd}&timezone=auto`
    const openMeteoRequest = await fetch(reqString);

    //console.log({reqString})

    return openMeteoRequest.json();
}

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

const parseOpenWeatherMapCode = (code) => {
    switch (code) {
        case 200:
          return "thunderstorms with light rain";
        case 201:
          return "thunderstorms with rain";
        case 202:
          return "thunderstorms with heavy rain";
        case 210:
          return "light thunderstorms";
        case 211:
          return "thunderstorms";
        case 212:
          return "heavy thunderstorms";
        case 221:
          return "ragged thunderstorms";
        case 230:
          return "thunderstorms with light drizzle";
        case 231:
          return "thunderstorms with drizzle";
        case 232:
          return "thunderstorms with heavy drizzle";
        case 300:
          return "light intensity drizzle";
        case 301:
          return "drizzle";
        case 302:
          return "heavy intensity drizzle";
        case 310:
          return "light intensity drizzle rain";
        case 311:
          return "drizzle rain";
        case 312:
          return "heavy intensity drizzle rain";
        case 313:
          return "shower rain and drizzle";
        case 314:
          return "heavy shower rain and drizzle";
        case 321:
          return "shower drizzle";
        case 500:
          return "light rain";
        case 501:
          return "moderate rain";
        case 502:
          return "heavy intensity rain";
        case 503:
          return "very heavy rain";
        case 504:
          return "extreme rain";
        case 511:
          return "freezing rain";
        case 520:
          return "light intensity shower rain";
        case 521:
          return "shower rain";
        case 522:
          return "heavy intensity shower rain";
        case 531:
          return "ragged shower rain";
        case 600:
          return "light snow";
        case 601:
          return "snow";
        case 602:
          return "heavy snow";
        case 611:
          return "sleet";
        case 612:
          return "light shower sleet";
        case 613:
          return "shower sleet";
        case 615:
          return "light rain and snow";
        case 616:
          return "rain and snow";
        case 620:
          return "light shower snow";
        case 621:
          return "shower snow";
        case 622:
          return "heavy shower snow";
        case 701:
          return "mist";
        case 711:
          return "smoke";
        case 721:
          return "haze";
        case 731:
          return "sand/dust whirls";
        case 741:
          return "fog";
        case 751:
          return "sand";
        case 761:
          return "dust";
        case 762:
          return "volcanic ash";
        case 771:
          return "squalls";
        case 781:
          return "tornado";
        case 800:
          return "clear skies";
        case 801:
          return "few clouds";
        case 802:
          return "scattered clouds";
        case 803:
          return "broken clouds";
        case 804:
          return "overcast clouds";
        default:
          return "unknown";
      }
}

/**
 * 
 * @param {DefaultPropsTemplate} props 
 * @returns {JSX}
 */
export const WeatherHeader = async (props) => {
    const {
      req,
      latitude, 
      longitude, 
      city, 
      units, 
      precision, 
      styles, 
      timeZoneOffset,
      og
    } = props;

    const sunriseSunsetCall = new Promise(async (resolve) => {
      const sunriseSunsetResponse = await fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${adjustedDayjsInstance({ timeZoneOffset }).format('YYYY-MM-DD')}&formatted=0`)
      const data = await sunriseSunsetResponse.json();
      resolve(data);
    })

    let [openMeteoData, sunriseSunsetData] = await Promise.all(
      [
        req, 
        sunriseSunsetCall
      ]
    );
    
/*     const openWeatherMapReq = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=226665da3951803c74770f482ea4c65b`)
    const openWeatherMapData = await openWeatherMapReq.json(); */

    const currentTemp = Math.round(openMeteoData.current_weather.temperature);
    const currentWeather = parseWeatherCode(openMeteoData.current_weather.weathercode);
    //console.log({openMeteoData})
    //const currentWeather = parseOpenWeatherMapCode(openWeatherMapData.weather[0].id);

    const sunset = dayjs(sunriseSunsetData.results.sunset)
    const sunrise = dayjs(sunriseSunsetData.results.sunrise)
    const curr = adjustedDayjsInstance({ timeZoneOffset });

    let night = true;
    if (curr.isAfter(sunrise)) {
      night = false;
      if (curr.isAfter(sunset)) {
        night = true
      } 
    }

    const gradient = generateTemperatureGradient(currentTemp, 
      { units, night }
    );
    const ogGradient = generateTemperatureGradient(currentTemp, 
      {
        og: true, 
        units, 
        night
      }
    );

    if (og === true) {
        return (
            <span data-gradient={ogGradient} style={
                {
                    maxWidth: '1100px',
                    color: '#e5e0d7',
                    fontWeight: 400,
                    fontSize: "85px", 
                    textTransform: "none", 
                    letterSpacing: '-0.05em',
                    lineHeight: "80px",
                    padding: "70px 0px 0px 70px",
                }
            }>It's {currentTemp}{units == 'metric' ? '°C' : '°F'} and {currentWeather} in {city}.</span> 
        )  
    }


    return (
        <>
        <span data-header-gradient={gradient} className={`${styles['greeting']}`}>{/* {GreetingText()} */}</span> 
        <span className={`${styles['filler']}`}>It's </span> 
        <span className={`${styles['weather-info']}`}><span className={units}>{currentTemp}</span> <span className={`${styles['filler']}`}> and </span> {currentWeather}</span> 
        <span className={`${styles['filler']}`}> in </span> 
        <span className={`${styles['weather-info']}`}>{city}.</span>
        <HeaderGradient {...props} gradient={gradient} />
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


const sunriseSunset = () => {
  //https://api.sunrise-sunset.org/json?lat=45&lng=-93
}

/**
 * 
 * @param {DefaultPropsTemplate} props 
 * @returns 
 */
export const WeatherTiles = async (props) => {
    const {
      req,
      latitude, 
      longitude, 
      city, 
      units, 
      precision, 
      styles, 
      timeZoneOffset,
      og
    } = props;

    let openMeteoData = await req;

    const [hourlyWeather, hourlyUnits] = [openMeteoData.hourly, openMeteoData.hourly_units];
    const [dailyWeather, dailyUnits] = [openMeteoData.daily, openMeteoData.daily_units];


    const generateTile = (label, value, dataArray) => {
        return (
            <div id={nanoid()} data-label={label} data-weather={JSON.stringify(dataArray)} draggable="true" className={`${styles['tile-item']} ${styles['']}`}>
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

    let currentTime = adjustedDayjsInstance({
      timeZoneOffset
    }).format('YYYY-MM-DDTHH:00');
    let timeIndex = hourlyWeather.time.indexOf(currentTime);
    //console.log({timeIndex, currentTime})

    const hourlyAndDailyWeather = Object.assign({}, hourlyWeather, dailyWeather);
    const hourlyAndDailyUnits = Object.assign({}, hourlyUnits, dailyUnits);

    for (let weatherVariable in hourlyAndDailyWeather) {
        if (weatherVariable.match('time|weathercode')) continue;

        const data = hourlyAndDailyWeather[weatherVariable];
        let displayLabel = betterLabels[weatherVariable];
        let displayValue = data[0];

        if (data.length > 16) { // hourly
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
        allTilesChildren.push(generateTile(displayLabel, displayValue, data))
    }



    return (
        <TilesWrapper timeIndex={timeIndex} styles={styles}>{allTilesChildren}</TilesWrapper>
    )
}

const retryNWS = async ({latitude, longitude}) => {
  const nwsRequest = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`, { cache: 'no-store' });
  const nwsData = await nwsRequest.json();

  return nwsData;
}

export const DetailedWeather = async ({latitude, longitude, og}) => {
    const nwsRequest = await fetch(`https://api.weather.gov/points/${latitude},${longitude}`);
    const nwsData = await nwsRequest.json();
  

    if (nwsData.status == 404) {
      console.log({nwsData})
      return <></>;
    }

    const nwsForecastRequest = await fetch(nwsData.properties.forecast);
    const nwsForecastData = await new Promise(async resolve => {
      let initial = await nwsForecastRequest.json();
      if (!initial?.properties) {
        let second = await retryNWS({latitude, longitude});

        if (!second?.properties) {
          let third = await retryNWS({latitude, longitude});
          resolve(third);
        } else {
          resolve(second);
        }

      } else {
        resolve(initial);
      }
    })
  
    //console.log('got it', nwsForecastData.properties.periods[0].detailedForecast);

    if (!nwsForecastData?.properties?.periods) {
      console.log(nwsForecastData)
    };
    const detailedForecast = nwsForecastData.properties.periods[0].detailedForecast;

    if (og === true) {
        return (
            <span
            style={{
                maxWidth: '1050px',
                height: '160px',
                overflow: 'hidden',
                fontSize: '36px',
                color: '#e5e0d7',
                margin: '50px 70px 20px',
                letterSpacing: '-0.03em',
            }}
            >{detailedForecast.substring(0, 190) + '...'}</span>
        )
    }

    return detailedForecast;
}




/**
 * 
 * @param {DefaultPropsTemplate} props 
 * @returns 
 */
export const Chart = async (props) => {
    const {
      req,
      latitude, 
      longitude, 
      city, 
      units, 
      precision, 
      styles, 
      timeZoneOffset,
      og
    } = props;

    let openMeteoData = await req;

    const hourlyWeather = openMeteoData.hourly;
    let currentTime = adjustedDayjsInstance({
      timeZoneOffset
    }).format('YYYY-MM-DDTHH:00');
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

