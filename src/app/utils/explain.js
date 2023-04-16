const weatherDescriptions = {
    "Time": "The time of the observation.",
    "Measured Temperature": "The current temperature measured at a weather station.",
    "Relative Humidity": "The amount of moisture in the air compared to the maximum amount the air could hold at the current. High humidity can make the air feel warmer and more oppressive, while low humidity can cause dehydration and dryness in the skin and mucous membranes.",
    "Dew Point": "Dew point is the temperature at which air must be cooled, at constant pressure, for water vapor to condense into liquid water. This occurs because as air cools, it becomes less able to hold moisture, causing water vapor to condense into tiny droplets. \n\n The dew point is an important measure of atmospheric moisture, as it affects human comfort and can impact a variety of activities, from agriculture to air conditioning. High dew points can make the air feel muggy and uncomfortable, while low dew points can make the air feel dry and crisp. ",
    "Apparent Temperature": "The temperature that it feels like outside, taking into account the actual temperature, relative humidity, and wind speed. The apparent temperature can be much higher or lower than the measured, depending on the conditions.",
    "Chance of Rain": "The likelihood that it will rain in the current location, expressed as a percentage. The chance of rain is based on a combination of weather models and historical data, but can never be 100% certain.",
    "Precipitation": "The amount of water that falls from the sky in any form, including rain, sleet, hail, and snow. Precipitation is usually measured in inches or millimeters over a specific period of time, such as an hour or a day.",
    "Rain": "Water droplets that fall from the sky in liquid form. Rain can be light or heavy, and can be accompanied by thunder, lightning, or wind.",
    "Showers": "Brief periods of rain or snow that come and go quickly. Showers are often caused by unstable air masses, and can be difficult to predict accurately.",
    "Snowfall": "The amount of snow that falls from the sky, measured in inches or centimeters over a specific period of time. Heavy snowfall can make travel difficult and cause power outages.",
    "Snow Depth": "The amount of snow that has accumulated on the ground, measured in inches or centimeters. Snow depth is an important factor in winter sports and can also affect transportation.",
    "Weather Code": "A numerical code that represents the current weather conditions at a specific location. The weather code is used by weather apps and websites to give users a quick overview of the conditions.",
    "Surface Pressure": "Surface pressure is the atmospheric pressure measured at the earth's surface. It is influenced by many factors, including, humidity, and wind patterns. High surface pressure typically indicates stable weather conditions, while low surface pressure is often associated with unsettled or stormy weather. ",
    "Cloud Cover": "The amount of the sky that is covered by clouds, expressed as a percentage. Cloud cover can affect the amount of solar radiation that reaches the ground and can also affect the likelihood of precipitation.",
    "Visibility": "The distance that a person can see clearly in the atmosphere. Poor visibility can make driving or flying dangerous, while high visibility can provide stunning views of the landscape. \n\n There are various categories of visibility, including clear, hazy, smoky, misty, and foggy. The categorization is based on the distance at which objects can be seen, as well as the concentration of airborne particles such as water droplets, smoke, or dust.",
    "Wind Speed": "The speed at which the air is moving horizontally, measured in miles per hour, kilometers per hour, or meters per second. High wind speeds can cause damage to buildings and vehicles, while low wind speeds can make the air feel stagnant.",
    "Wind Speed at 80m": "The speed at which the air is moving horizontally, measured in miles per hour, kilometers per hour, or meters per second. High wind speeds can cause damage to buildings and vehicles, while low wind speeds can make the air feel stagnant.",
    "Wind Direction": "The true direction from which the wind is blowing at a given location (i.e., wind blowing from the north to the south is a north wind). It is normally measured in tens of degrees from 10 degrees clockwise through 360 degrees. North is 360 degrees. A wind direction of 0 degrees is only used when wind is calm.",
    "Wind Direction at 80m": "The true direction from which the wind is blowing at a given location (i.e., wind blowing from the north to the south is a north wind). It is normally measured in tens of degrees from 10 degrees clockwise through 360 degrees. North is 360 degrees. A wind direction of 0 degrees is only used when wind is calm.",
    
    
    "Wind Gusts": "Rapid fluctuations in the wind speed with a variation of 10 knots or more between peaks and lulls. The speed of the gust will be the maximum instantaneous wind speed.",
    "Max Temperature": "The highest measured at the observation site during the specified period.",
    "Min Temperature": "The lowest measured at the observation site during the specified period.",
    "Max Apparent Temperature": "The highest apparent felt by the human body during the specified period.",
    "Min Apparent Temperature": "The lowest apparent felt by the human body during the specified period.",
    "Sunrise": "The time at which the sun rises at the observation site.",
    "Sunset": "The time at which the sun sets at the observation site.",
    "Max UV Index": "The highest UV index recorded at the observation site during the specified period.",
    "Total Precipitation": "The total amount of liquid or solid precipitation that has fallen at the observation site during the specified period.",
    "Total Rain": "The total amount of liquid precipitation that has fallen at the observation site during the specified period.",
    "Total Showers": "The total amount of heavy rain or other precipitation that has occurred at the observation site during the specified period.",
    "Total Snowfall": "The total amount of snowfall that has occurred at the observation site during the specified period.",
    "Precipitation Hours": "The number of hours during the specified period in which precipitation occurred.",
    "Max Precipitation Probability": "The highest probability of precipitation occurring during the specified period.",
    "Max Wind Speed": "The highest wind speed recorded at the observation site during the specified period.",
    "Max Wind Gusts": "The highest wind gusts recorded at the observation site during the specified period.",
    "Dominant Wind Direction": "Dominant wind direction for a day is a measure of the direction from which wind blows most frequently or consistently during a 24-hour period. This information is useful in forecasting weather conditions, as it can affect temperature, humidity, and precipitation patterns. Factors that influence dominant wind direction can include regional topography, high- and low-pressure systems, and atmospheric conditions"
}  

export const getWeatherDescription = (betterLabel) => {
    const description = weatherDescriptions[betterLabel];
    return description;
}

import { linearRegression } from "simple-statistics";


/**
 * 
 * @param {Array} weatherData384Array 
 * @param {String} paramName 
 * @param {Object} config 
 * @return {Array<string>}
 */
export const analyze384hourArray = (weatherData384Array, paramName, config={
    threshold: 50
}) => {
    const textAnalyzations = [];

    // Calculate average
    const avgTemp = weatherData384Array.reduce((acc, curr) => acc + curr, 0) / weatherData384Array.length;
    console.log(`The average during the 384 hours was ${avgTemp} degrees Celsius.`);

    // Find maximum and minimum
    const maxTemp = Math.max(...weatherData384Array);
    const minTemp = Math.min(...weatherData384Array);
    console.log(`The maximum during the 384 hours was ${maxTemp} degrees Celsius, and the minimum was ${minTemp} degrees Celsius.`);

    // Analyze trend over time
    const trend = [];
    for (let i = 0; i < weatherData384Array.length - 1; i++) {
    const tempDiff = weatherData384Array[i + 1] - weatherData384Array[i];
    trend.push(tempDiff);
    }
    const positiveTrend = trend.filter(diff => diff > 0).length;
    const negativeTrend = trend.filter(diff => diff < 0).length;
    console.log(`The was trending up ${positiveTrend} times and trending down ${negativeTrend} times.`);

    const oneDay = weatherData384Array.slice(0, 23)
    const timeData = oneDay.map((data, i) => i);
    const regression = linearRegression([timeData, oneDay]);
    console.log({regression, oneDay})

    return textAnalyzations;
}

