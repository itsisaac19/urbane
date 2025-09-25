# Urbane Weather
This project is an ultra-modern, highly granular weather application designed to provide users with accurate weather data. It features an interactive radar system, advanced data visualization, and a customizable dashboard. The application is built using Next.js, React, Mapbox GL, and Chart.js, and is deployed on Vercel.

## Current Snapshots

#### Landing Page
![Alt text for the image](./media/urbaneweather_landing_scsrt.png "Latest Landing Snapshot")

#### Home Page
![Alt text for the image](./media/urbaneweather_home_scsrt.png "Latest Home Snapshot")

#### Loading and Radar Tiles
![Alt text for the image](./media/urbaneweather_loading_tiles_scsrt.png "Latest Loading Tiles Snapshot")
![Alt text for the image](./media/urbaneweather_radar_tiles_scsrt.png "Latest Radar Snapshot")

# Notable Features

**Radar with Mapbox GL**: This project integrates NOAA's WMS geoserver with Mapbox GL to create an interactive and fluid weather radar system. It queries NOAA's GetCapabilities service, parses XML responses, and transforms temporal radar data into animated tile layers. The system features time-scrubbing functionality through custom range slider controls, automatic radar animation loops, and dynamic layer management with selective rendering.


**Data Analysis**: This project implements Chart.js with custom gradient backgrounds for advanced weather visualization across multiple timeframes (24h, 48h, 72h, 7d). The charting system includes tooltips, data point highlighting, and animations that enhance the user experience.

**Intentional Design System**: Features a CSS Grid layout that allows for granular data customization. Users can pin different weather data tiles to their home dashboard based on their preferences.

**Meta Tags and SEO**: This project uses experimental edge functions in Vercel to dynamically generate meta tags for each page, enhancing SEO and social media sharing capabilities. See some examples below:
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 10px; margin-bottom: 40px;">
    <img src="./media/meta-tags-ios.png" height=auto width=auto alt="Meta Tags Example" title="Meta Tags Example" />
    <img src="./media/meta-tags-ios-02.png" height=auto width=auto alt="Meta Tags Example 2" title="Meta Tags Example" />
    <img src="./media/meta-tags-ios-03.png" height=auto width=auto alt="Meta Tags Example 3" title="Meta Tags Example" />
</div>


# Usage
You can try out the application by visiting [urbaneweather.vercel.app](https://urbaneweather.vercel.app/)