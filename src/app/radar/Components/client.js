'use client'
// RADAR

import { createRef, useEffect } from 'react';
import { xmlToJson } from '@/app/utils/xml';
import { runAtTrueMinute } from '@/app/utils/time';

const dayjs = require('dayjs');

const mapboxToken = 'pk.eyJ1IjoiaXRzaXNhYWMxOSIsImEiOiJja2xiMmpraTEwZDIyMndvMzE5cGd1eTlyIn0.V2gQnHEAqZEugJKp82pUaQ';

const RainViewerMaps = async () => {
    const mapRequest = await fetch(`https://api.rainviewer.com/public/weather-maps.json`);
    const mapResponse = await mapRequest.json();

	const tilesEndpoint = `https://tilecache.rainviewer.com${endpoints.radar.nowcast[0].path}/256/{z}/{x}/{y}/4/1_1.png`;

    return mapResponse;
};

/**
 * 
 * @param {String} timeDimension 
 * @param {Number} tileSize 
 * @returns {String}
 */
const baseRadarQCMosaicURL = (timeDimension, tileSize) => {
    return `https://opengeo.ncep.noaa.gov:443/geoserver/conus/conus_bref_qcd/ows?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=conus_bref_qcd&TIME=${timeDimension}&STYLES=&FORMAT=image/png&TRANSPARENT=TRUE&HEIGHT=${tileSize}&WIDTH=${tileSize}&CRS=EPSG:3857&BBOX={bbox-epsg-3857}`
}

const parseTimeDimensionFromMosaic = (mosaicURL) => {
    let url = new URL(mosaicURL);

    switch (url.host) {
        case 'opengeo.ncep.noaa.gov':
            let dimension = new URLSearchParams(url.search).get('TIME')
            return dimension
    
        default:
            return new URLSearchParams(url.search).get('time')
    }
}


const loadBaseRadarMosaicList = async (tileSize) => {
    console.log({tileSize})
    const GetCapabilitiesReq = await fetch(`https://opengeo.ncep.noaa.gov/geoserver/conus/conus_bref_qcd/ows?SERVICE=WMS&request=GetCapabilities`);
    const res = await GetCapabilitiesReq.text();


    let {timeDimensionsArray, GetCapabilitiesJSON} = await new Promise(async (resolve) => {
        try {
            const xml = new DOMParser().parseFromString(res, 'text/xml');
            let GetCapabilitiesJSON = xmlToJson(xml);
            let timeDimensionsArray = GetCapabilitiesJSON.WMS_Capabilities.Capability.Layer.Layer.Dimension["#text"]["#text"].split(',');
            
            if (xml) {
                console.log('Using `DOMParser()`')
                resolve({
                    timeDimensionsArray, 
                    GetCapabilitiesJSON
                })
            }
        
        } catch (error) {
            /* const converter = (await import('xml-js')).xml2js; 
            let GetCapabilitiesJSON = converter(res, {compact: true, spaces: 4})
            let timeDimensionsArray = GetCapabilitiesJSON.WMS_Capabilities.Capability.Layer.Layer.Dimension['_text'].split(',');

            console.log('wait...') */
        }
    })

    console.log(GetCapabilitiesJSON)
                    
    timeDimensionsArray = timeDimensionsArray.filter((element, index) => {
        return (index) % 3 === 0;
    })

    console.log({timeDimensions: timeDimensionsArray.map(dimension => {
        return dayjs(dimension).format('h:mm a')
    })})

    timeDimensionsArray = timeDimensionsArray.map(dimension => {
        return baseRadarQCMosaicURL(dimension, tileSize)
    })

    const mosaicList = [...timeDimensionsArray];

    return mosaicList;
}

export const Radar = (props) => {
	const radarElementRef = createRef(); 

	const {latitude, longitude, styles} = props;

	const importMapboxAndRadars = async () => {
		const mapboxgl = (await import('mapbox-gl')).default;
		mapboxgl.accessToken = mapboxToken;

        const tileSize = 256;

        const baseRadarMosaicList = await loadBaseRadarMosaicList(tileSize);

        const radars = { 
            base: {
                tileSize,
                mosaicList: baseRadarMosaicList,
            }
        }

        console.log('Radar mosaics loaded:', { radars })

		return [mapboxgl, radars]
	}
	const importMapbox = importMapboxAndRadars();
	
	useEffect(() => {

        /**
         * @param {String} prefix
         * @param {Array<String>} mosaicList
         * @returns {Promise} 
        */
        const renderRadar = async (prefix='base-radar', tileSize=512, mosaicList, Map) => {
            const renderedRadar = new Promise((resolve) => {
                const layers = Map.getStyle().layers;
                // Find the index of the first symbol layer in the map style.
                let firstSymbolId;
                for (const layer of layers) {
                    if (layer.type === 'symbol') {
                        firstSymbolId = layer.id;
                        break;
                    }
                }

                // Cleanup previous sources
                for (let layer of layers) {
                    if (layer.id.includes('radar')) {
                        Map.removeLayer(layer.id);
                        Map.removeSource(layer.id);
                    }
                }

                const layerIds = [];

                const loaderGrid = selectByClassName('loader-grid', styles);
                loaderGrid.classList.add(styles['loading']);

                const mapBoxDiv = selectByClassName('mapbox-radar', styles);
                mapBoxDiv.classList.add(styles['loading'])

                for (let dimensionIndex in mosaicList) {
                    const loaderTile = Object.assign(document.createElement('div'), {
                        className: styles['loader-tile'],
                        innerHTML: `L${parseInt(dimensionIndex) + 1}`
                    })
                    loaderGrid.appendChild(loaderTile)
                }

                for (let dimensionIndex in mosaicList) {
                    const layerId = `${prefix}-${dimensionIndex}`;
                    layerIds.push(layerId);

                    let rasterOpacity = 0;
                    if (dimensionIndex == 0) rasterOpacity = 1;

                    Map.addLayer(
                        {
                            'id': layerId,
                            'type': 'raster',
                            'source': {
                                'type': 'raster',
                                'tiles': [
                                    mosaicList[dimensionIndex]
                                ],
                                'tileSize': tileSize,
                            },
                            'paint': {
                                'raster-opacity': rasterOpacity,
                                'raster-opacity-transition': {
                                    duration: 0,
                                    delay: 0,
                                }
                            }
                        }, firstSymbolId
                    );

                    let x = setInterval(() => {
                        let isLoaded = Map.isSourceLoaded(layerId);

                        if (isLoaded) {
                            loaderGrid.children[dimensionIndex].classList.add(styles['loaded'])
                            clearInterval(x)
                        };
                    }, 100)
                }
                
                Map.on('drag', () => {
                    for(let idIndex in layerIds) {
                        loaderGrid.children[idIndex].classList.remove(styles['loaded']);
                        let x = setInterval(() => {
                            let isLoaded = Map.isSourceLoaded(layerIds[idIndex]);
                            if (isLoaded) {
                                loaderGrid.children[idIndex].classList.add(styles['loaded'])
                                clearInterval(x)
                            } else {
                                console.log(idIndex, 'loading...')
                            };
                        }, 500)
                    }
                });

                Map.once('idle', (e) => {
                    console.log({layerIds})
                    Map.setPaintProperty(layerIds[0], 'raster-opacity', 1);

                    for (let idleHideLayerCount in layerIds) {
                        if (idleHideLayerCount == 0) continue;
                        Map.setLayoutProperty(layerIds[idleHideLayerCount], 'visibility', 'none');
                    }

                    console.log(`${prefix} - loaded.`, {mosaicList, e});
                    resolve({
                        layerIds, timeDimensionsArray: mosaicList
                    });
                });
            })

            return renderedRadar;
        }


        const showRadar = async (prefix, tileSize=512, mosaicList, Map) => {
            const currentRadar = await renderRadar(prefix, tileSize=512, mosaicList, Map);

            let animationInterval;
            let currentIndex = 0;

            const playAnimation = (e) => {
                const layerIds = currentRadar.layerIds;
                // Animate the layers over time
                
                animationInterval = setInterval(function() {
                    console.log({currentIndex});

                    const currentTime = currentRadar.timeDimensionsArray[currentIndex];
                    console.log({currentTime}, dayjs(currentTime).format('h:mm a'))

                    // Hide the current layer
                    Map.setLayoutProperty(layerIds[currentIndex], 'visibility', 'none');
                    Map.setPaintProperty(layerIds[currentIndex], 'raster-opacity', 0);
                
                    // Increment the index and wrap around at the end
                    currentIndex = (currentIndex + 1) % layerIds.length;
                
                    // Show the next layer
                    Map.setLayoutProperty(layerIds[currentIndex], 'visibility', 'visible');
                    Map.setPaintProperty(layerIds[currentIndex], 'raster-opacity', 1);
                }, 1000);   
            }

            const mapBoxDiv = selectByClassName('mapbox-radar', styles);
            mapBoxDiv.classList.remove(styles['loading']);

            const controlsOuter = selectByClassName('controls-slider', styles);
            controlsOuter.classList.remove(styles['waiting'])

            const loaderGrid = selectByClassName('loader-grid', styles);
            loaderGrid.classList.remove(styles['loading'])
            loaderGrid.classList.add(styles['reloading']);

            const tooltip = selectByClassName('map-time-tooltip', styles);
            tooltip.dataset.timestamps = JSON.stringify(currentRadar.timeDimensionsArray);
            const mosaicArray = JSON.parse(tooltip.dataset.timestamps);

            const range = selectByClassName('slider-range', styles);
            range.classList.remove(styles['disable']);
            range.max = currentRadar.layerIds.length - 1;

            setTimeout(() => {
                selectByClassName('sub-grid-1', styles).classList.add(styles['done-load'])
            }, 600)
    
            const mapTime = selectByClassName('map-time-value', styles);
            const mapStartTime = dayjs(parseTimeDimensionFromMosaic(mosaicArray[0])).format('h:mm A');
            mapTime.innerHTML = mapStartTime;
            tooltip.innerHTML = mapStartTime;

            let sliderStartText = selectByClassName('slider-start', styles);
            sliderStartText.innerHTML = mapStartTime;
            let sliderEndText = selectByClassName('slider-end', styles);
            sliderEndText.innerHTML = dayjs(parseTimeDimensionFromMosaic(mosaicArray[mosaicArray.length - 1])).format('h:mm A');

            range.addEventListener('input', (e) => {
                const value = range.value;
                const min = range.min ? range.min : 0;
                const max = range.max ? range.max : 100;
                const percent = ((value - min) / (max - min)) * 100;
                tooltip.style.left = percent + '%';
                
                const dimensionIndex = parseInt(e.currentTarget.value);
    
                const timeDimension = parseTimeDimensionFromMosaic(mosaicArray[dimensionIndex]);
                tooltip.innerHTML = dayjs(timeDimension).format('h:mm A');
                mapTime.innerHTML = dayjs(timeDimension).format('h:mm A');

                const layerIds = currentRadar.layerIds;

                // Hide the current layer
                Map.setLayoutProperty(layerIds[currentIndex], 'visibility', 'none');
                Map.setPaintProperty(layerIds[currentIndex], 'raster-opacity', 0);
            
                // Increment the index and wrap around at the end
                currentIndex = dimensionIndex;
            
                // Show the next layer
                Map.setLayoutProperty(layerIds[currentIndex], 'visibility', 'visible');
                Map.setPaintProperty(layerIds[currentIndex], 'raster-opacity', 1);
            });
        }

		const createMap = async () => {
            return new Promise(async (resolve) => {
                const [mapboxInstance, radars] = await importMapbox;

                const radarElement = radarElementRef.current;
                const Map = new mapboxInstance.Map({
                    container: radarElement.id,
                    style: "mapbox://styles/mapbox/dark-v10",
                    center: [longitude, latitude], // starting position
                    zoom: 6, // starting zoom
                    minZoom: 6,
                    maxZoom: 8,
                    transition: {
                        duration: 0,
                        delay: 0,
                    },
        
                });
                Map.dragRotate.disable();
                Map.touchZoomRotate.disableRotation();
    
                const baseRadarLabel = selectByClassName('base-radar', styles);
                baseRadarLabel.dataset.timestamps = JSON.stringify(radars.base.mosaicList);
    
                Map.on('load', (e) => {
                    resolve(Map);
                });
            })

		}

        /**
         * 
         * @param {Array<String>} labelClasses 
         */
        const assignListeners = async (labelClasses) => {
            const Map = await createMap();

            labelClasses.forEach(labelClass => {
                const labelElement = selectByClassName(labelClass, styles);
                const labelText = labelElement.querySelector(`.${styles['item-label']}`);

                labelElement.onclick = (e) => {
                    console.log({e});

                    if (labelText.classList.contains(styles['active'])) {
                        return console.log('already active.')
                    }

                    labelText.classList.add(styles['active'])

                    const mosaicList = JSON.parse(e.currentTarget.dataset.timestamps);
                    showRadar(labelClass, 400, mosaicList, Map)
                };
                
            })

        }
        assignListeners(['base-radar'])
	})


    return (<div id={'home-radar'} className={styles['mapbox-radar']} ref={radarElementRef}></div>);
}

/**
 * 
 * @param {string} CSSSelector 
 * @returns {Element}
 */
const selectByClassName = (CSSSelector, styles) => {
    return document.querySelector(`.${styles[CSSSelector]}`);
}

/**
 * 
 * @param {Element} valueElement 
 */
const updateCurrentTimer = (styles) => {
    const currentTimer = selectByClassName('current-time-value', styles);
    if (!currentTimer) return;
    currentTimer.innerHTML = dayjs().format('h:mm A');
}

export const CurrentTimer = (props) => {
    const { styles } = props;

    useEffect(() => {
        const minuteTimeout = runAtTrueMinute(() => {
            updateCurrentTimer(styles)
        });

        return () => {
            clearTimeout(minuteTimeout)
        }
    })

    return (dayjs().format('h:mm A'))
}
