'use client'

import { nanoid } from 'nanoid'
import { createRef, useRef, useEffect, useState } from 'react';
import { analyze384hourArray, getWeatherDescription } from '@/app/utils/explain';


const dayjs = require('dayjs');
const duration = require('dayjs/plugin/duration');
dayjs.extend(duration);

export const ReadableDate = () => {
	return dayjs().format('dddd MMMM D')
}

export const Countdown = ({lastReqTime}) => {
	const [countdownText, setCountdownText] = useState('')
    useEffect(() => {
		const countDownDate = dayjs(lastReqTime).add(1, 'hour');

		const updateCountdown = () => {
			// Get the current date and time
			let now = dayjs();
	
			// Calculate the remaining time
			let duration = dayjs.duration(countDownDate.diff(now));
	
			// Calculate hours, minutes, and seconds
			let hours = duration.hours();
			let minutes = duration.minutes();
			let seconds = duration.seconds();
	
			// Format the remaining time as "hh:mm:ss"
			let countdownString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	
			// Update the countdown timer element
			//console.log(countdownString);
			
	
			// If the countdown is over, clear the interval and display a message
			if (duration.asSeconds() <= 0) {
				window.location.reload();
				console.log("Time's up!");
			}
		

			setCountdownText(`-${countdownString}`)
		}


		let now = new Date();
		let timeUntilNextSecond = 1000 - now.getMilliseconds();
		setTimeout(updateCountdown, timeUntilNextSecond);
	})

	return (<span>{countdownText}</span>)
}

export const ClockTiles = ({styles}) => {
    const clockRef = createRef();

    const h1Grid = createRef();
    const h2Grid = createRef();
    const m1Grid = createRef();
    const m2Grid = createRef();
    const s1Grid = createRef();
    const s2Grid = createRef();

    const tileHeight = 87;

    useEffect(() => {
		clockRef.current.classList.remove(styles.wait);

        const runEverySecond = () => {
			if (!h1Grid.current) return;

            let [h1, h2] = dayjs().format('HH').split('');

            let [m1, m2] = dayjs().format('mm').split('');
        
            let [s1, s2] = dayjs().format('ss').split('');
        
            let str = `${h1}${h2}:${m1}${m2}:${s1}${s2}`;
            //console.log(str);

            h1Grid.current.setAttribute('tempval', h1);
            h2Grid.current.setAttribute('tempval', h2);
            m1Grid.current.setAttribute('tempval', m1);
            m2Grid.current.setAttribute('tempval', m2);
            s1Grid.current.setAttribute('tempval', s1);
            s2Grid.current.setAttribute('tempval', s2);

            [h1Grid, h2Grid, m1Grid, m2Grid, s1Grid, s2Grid].forEach(gridRef => {
				if (!gridRef?.current) return;

                let tempVal = gridRef.current.getAttribute('tempval');

                if (tempVal == 0) {
                    const gridRows = gridRef.current.childElementCount;
                    if (gridRef.current.style.translate == `0px`) {
                        return;
                    }


                    gridRef.current.style.translate = `0px -${(gridRows - 1) * 87}px`;

                    setTimeout(() => {
						if (!gridRef) return;
						gridRef.current.style.transition = `none`;
                        gridRef.current.style.translate = `0px 0px`;
    
                        setTimeout(() => {
                            gridRef.current.style.transition = null;
                        }, 100);
                    }, 700);
                } else {
                    gridRef.current.style.translate = `0px -${parseInt(tempVal) * 87}px`;
                }
            }) 
        }

		let interval = setInterval(() => {
            var now = new Date();
            var timeUntilNextSecond = 1000 - now.getMilliseconds();
            setTimeout(runEverySecond, timeUntilNextSecond);
        }, 1000);

		return () => {
			clearInterval(interval)
		}
    })

    return (
        <div ref={clockRef} className={styles.wait}>
            <div className={`${styles['clock-tiles']}`}>
                        <div className={`${styles['clock']} ${styles['ten-hour']}`}>
							<div ref={h1Grid} tempval={0} className={`${styles['ten-hour-grid']} ${styles['clock-tile-grid']}`}>
								<span className={`${styles['ten-hour-value']}`}>0</span>
								<span className={`${styles['ten-hour-value']}`}>1</span>
								<span className={`${styles['ten-hour-value']}`}>2</span>
								<span className={`${styles['ten-hour-value']}`}>0</span>
							</div>
						</div> 
                        <span className={`${styles['clock']} ${styles['hour']}`}>
							<div ref={h2Grid} tempval={0} className={`${styles['hour-grid']} ${styles['clock-tile-grid']}`}>
								<span className={`${styles['hour-value']}`}>0</span>
								<span className={`${styles['hour-value']}`}>1</span>
								<span className={`${styles['hour-value']}`}>2</span>
								<span className={`${styles['hour-value']}`}>3</span>
								<span className={`${styles['hour-value']}`}>4</span>
								<span className={`${styles['hour-value']}`}>5</span>
								<span className={`${styles['hour-value']}`}>6</span>
								<span className={`${styles['hour-value']}`}>7</span>
								<span className={`${styles['hour-value']}`}>8</span>
								<span className={`${styles['hour-value']}`}>9</span>
								<span className={`${styles['hour-value']}`}>0</span>
							</div>
						</span> 
                        <span className={`${styles['clock']} ${styles['ten-minute']}`}>
							<div ref={m1Grid} tempval={0} className={`${styles['ten-minute-grid']} ${styles['clock-tile-grid']}`}>
								<span className={`${styles['ten-minute-value']}`}>0</span>
								<span className={`${styles['ten-minute-value']}`}>1</span>	
								<span className={`${styles['ten-minute-value']}`}>2</span>	
								<span className={`${styles['ten-minute-value']}`}>3</span>	
								<span className={`${styles['ten-minute-value']}`}>4</span>		
								<span className={`${styles['ten-minute-value']}`}>5</span>	
								<span className={`${styles['ten-minute-value']}`}>0</span>	
							</div>	
						</span> 
                        <span className={`${styles['clock']} ${styles['minute']}`}>
							<div ref={m2Grid} tempval={0} className={`${styles['minute-grid']} ${styles['clock-tile-grid']}`}>
								<span className={`${styles['minute-value']}`}>0</span>
								<span className={`${styles['minute-value']}`}>1</span>	
								<span className={`${styles['minute-value']}`}>2</span>	
								<span className={`${styles['minute-value']}`}>3</span>	
								<span className={`${styles['minute-value']}`}>4</span>		
								<span className={`${styles['minute-value']}`}>5</span>	
								<span className={`${styles['minute-value']}`}>6</span>	
								<span className={`${styles['minute-value']}`}>7</span>	
								<span className={`${styles['minute-value']}`}>8</span>	
								<span className={`${styles['minute-value']}`}>9</span>	
								<span className={`${styles['minute-value']}`}>0</span>	
							</div>
						</span> 
                        <span className={`${styles['clock']} ${styles['ten-second']}`}>
							<div ref={s1Grid} tempval={0} className={`${styles['ten-second-grid']} ${styles['clock-tile-grid']}`}>
								<span className={`${styles['ten-second-value']}`}>0</span>
								<span className={`${styles['ten-second-value']}`}>1</span>	
								<span className={`${styles['ten-second-value']}`}>2</span>	
								<span className={`${styles['ten-second-value']}`}>3</span>	
								<span className={`${styles['ten-second-value']}`}>4</span>		
								<span className={`${styles['ten-second-value']}`}>5</span>	
								<span className={`${styles['ten-second-value']}`}>0</span>	
							</div>
						</span> 
                        <span className={`${styles['clock']} ${styles['second']}`}>
							<div ref={s2Grid} tempval={0} className={`${styles['second-grid']} ${styles['clock-tile-grid']}`}>
								<span className={`${styles['second-value']}`}>0</span>
								<span className={`${styles['second-value']}`}>1</span>	
								<span className={`${styles['second-value']}`}>2</span>	
								<span className={`${styles['second-value']}`}>3</span>	
								<span className={`${styles['second-value']}`}>4</span>		
								<span className={`${styles['second-value']}`}>5</span>	
								<span className={`${styles['second-value']}`}>6</span>	
								<span className={`${styles['second-value']}`}>7</span>	
								<span className={`${styles['second-value']}`}>8</span>	
								<span className={`${styles['second-value']}`}>9</span>
								<span className={`${styles['second-value']}`}>0</span>
							</div>
						</span> 
                    </div>
        </div>
    )
}

export const TilesGrid = (props) => {
	const tileLabels = props.tileLabels;
	const setTileLabels = props.setTileLabels;

	let styles = props.styles; 

    function allowDrop(ev) {
        ev.preventDefault();
    }

	function dragEnter (ev) {}
	function dragExit (ev) {}
      
    function drag(ev) {
		let pinnedContainer = document.querySelector(`.${styles['pinned']}`).children[1];
		let allContainer = document.querySelector(`.${styles['all']}`).children[1];

		if (allContainer.contains(ev.target)) {
			pinnedContainer.classList.add(styles['possible-drop-zone'])
		} else {
			allContainer.classList.add(styles['possible-drop-zone'])
		}

        ev.dataTransfer.setData('text', ev.target.id);
    }
	function dragEnd (ev) {
		let pinnedContainer = document.querySelector(`.${styles['pinned']}`).children[1];
		let allContainer = document.querySelector(`.${styles['all']}`).children[1];

		pinnedContainer.classList.remove(styles['possible-drop-zone'])
		allContainer.classList.remove(styles['possible-drop-zone'])
    }

    function drop(ev) {

        const data = ev.dataTransfer.getData('text');
		const tileDragging = document.getElementById(data);

		let pinnedGrid = document.querySelector(`.${styles['pinned']}`).children[1];
		let allGrid = document.querySelector(`.${styles['all']}`).children[1];

		if (!ev.target.classList.contains(styles['tiles-grid'])) {
			let tileDroppedOn = ev.target.classList.contains(styles['tile-item']) ? ev.target : ev.target.parentElement;

			if (pinnedGrid.contains(ev.target)) {
				console.log('pinned contains', ev.target, {tileDroppedOn})
				console.log('adding ', tileDragging.dataset.label, ' to', tileLabels);
				
				pinnedGrid.insertBefore(tileDragging, tileDroppedOn);
			} else {
				console.log('all contains', ev.target);
				
				allGrid.insertBefore(tileDragging, tileDroppedOn);
			}
		} else {
			let grid = ev.currentTarget;
			grid.appendChild(tileDragging);
		}


		const allTilelabels = Array.from(allGrid.children).map(tile => {
			return tile.dataset.label;
		});
		const pinnedTileLabels = Array.from(pinnedGrid.children).map(tile => {
			return tile.dataset.label;
		});

		setTileLabels(previousTileLabelsObject => {
			let all = {...previousTileLabelsObject.all};
			all = allTilelabels;

			let pinned = {...previousTileLabelsObject.pinned};
			pinned = pinnedTileLabels;

			return {
				all,
				pinned
			}
		});

		console.log({allTilelabels, pinnedTileLabels})
    }

	const gridRef = createRef();
	const isFirstRender = useRef(true); 
	const isSubsequentRender = useRef(true); 

	if (props.prefix === 'all') {
		useEffect(() => {
			if (isFirstRender.current) {
				isFirstRender.current = false;
			} else if (isSubsequentRender.current) {
				isSubsequentRender.current = false;

				//console.log('called from pinnedTiles', tileLabels)
				tileLabels.pinned.forEach(tileLabel => {
					let pinnedContainer = document.querySelector(`.${styles['pinned']} .${styles['tiles-grid']}`);
					let tileToPin = gridRef.current.querySelector(`[data-label="${tileLabel}"]`);
					
					if (pinnedContainer) {
						pinnedContainer.appendChild(tileToPin)
					}
				})
				
				// Rearrange ALL tiles
				tileLabels.all.forEach((tileLabel, index) => {
					let allContainer = document.querySelector(`.${styles['all']} .${styles['tiles-grid']}`);
					let tileToPin = gridRef.current.querySelector(`[data-label="${tileLabel}"]`);
					
					allContainer.appendChild(tileToPin)
				})
			}
		}, [tileLabels])
	}

	let currentTimeout = 'hidden';

	const hideExplain = (e) => {
		const explainElement = document.querySelector(`.${styles['tile-explain']}`);
		explainElement.parentElement.classList.remove(styles['explain-state']);

		currentTimeout = setTimeout(() => {
			explainElement.parentElement.classList.add(styles['hide']);
			currentTimeout = 'hidden'
		}, 300)
	}

	const tileClickHandler = (e) => {
		const tile = e.currentTarget;
		const explainElement = document.querySelector(`.${styles['tile-explain']}`);

		const description = getWeatherDescription(tile.dataset.label);

		const titleElement = explainElement.querySelector(`.${styles['explain-label']}`);

		const descriptionElement = explainElement.querySelector(`.${styles['explain-content']}`);

		const texts = analyze384hourArray(JSON.parse(tile.dataset.weather), tile.dataset.label, {})
		
		const analysisWrap = explainElement.querySelector(`.${styles['explain-analysis-wrap']}`)
		analysisWrap.innerHTML = '';

		texts.forEach(stat => {
			const statItem = Object.assign(document.createElement('div'), {
				innerHTML: stat,
				className: styles['explain-analysis-text']
			});

			analysisWrap.appendChild(statItem);
		})

		explainElement.querySelector('.explain-close-btn').onclick = () => {
			hideExplain();
			explainElement.classList.remove(styles['show']);

			explainElement.querySelector('.explain-close-btn').onclick = null;
		};

		console.log({currentTimeout})
		explainElement.parentElement.classList.remove(styles['hide']);

		let waitDuration = 100;

		if (currentTimeout == 'stay') {
			explainElement.classList.add(styles['change']);

			setTimeout(() => {
				titleElement.innerHTML = tile.dataset.label;
				descriptionElement.innerHTML = description;

				setTimeout(() => {
					explainElement.classList.remove(styles['change']);
				})
			}, 200);
			
			waitDuration = 300;

		} else {
			if (typeof currentTimeout === 'number') {
				clearTimeout(currentTimeout);
			}
			titleElement.innerHTML = tile.dataset.label;
			descriptionElement.innerHTML = description;

			currentTimeout = 'stay';
		} 

		setTimeout(() => {
			explainElement.parentElement.classList.add(styles['explain-state'])
			explainElement.classList.add(styles['show']);
		}, waitDuration)
	}

	useEffect(() => {
		console.log('adding listeners to', props.prefix)
		Array.from(gridRef.current.children).forEach(tile => {
			tile.addEventListener('dragstart', drag)
			tile.addEventListener('dragend', dragEnd)

			tile.addEventListener('click', tileClickHandler)
		});
	}, [])


	return (
		<div ref={gridRef} onDragEnter={dragEnter} onDragExit={dragExit} onDrop={drop} onDragOver={allowDrop} className={`${styles['tiles-grid']}`}>
			{props.children}
		</div>
	)
}


export const TilesWrapper = (props) => {
	const styles = props.styles;
	const parentRef = createRef()

	const isFirstRender = useRef(true); 
	const isSecondRender = useRef(true); 
	const [tileLabels, setTileLabels] = useState();

	useEffect(() => {
		const saved = localStorage.getItem('tileLabels');
		const initialArray = saved ? JSON.parse(saved) : {
			all: [],
			pinned: []
		};

		console.log('inital pinned:', initialArray);

		setTileLabels(initialArray); 
	}, []);

	useEffect(() => {

		if (isFirstRender.current) {
			isFirstRender.current = false;
		} else if (isSecondRender.current) {
			isSecondRender.current = false;
			
			parentRef.current.classList.remove(styles['hide'])
		} else {
			console.log('saving to local storage')
			localStorage.setItem('tileLabels', JSON.stringify(tileLabels));
		}

	}, [tileLabels])

	return (
		<div ref={parentRef} className={`${styles['parent-tiles-wrap']} ${styles['hide']}`}>
			<div className={`${styles['tiles-section']} ${styles['pinned']}`}>
				<span className={`${styles['tiles-section-label']} ${styles['pinned-text']}`}>Pinned Tiles</span>  
				<TilesGrid 
				tileLabels={tileLabels} 
				setTileLabels={setTileLabels} 

				prefix={'pinned'} 
				styles={styles} 
				timeIndex={props.timeIndex}
				>
				
				</TilesGrid>
			</div>

			<div className={`${styles['tiles-section']} ${styles['all']}`}>
				<span className={`${styles['tiles-section-label']} ${styles['pinned-text']}`}>All Tiles</span>  

				<TilesGrid 

				tileLabels={tileLabels} 
				setTileLabels={setTileLabels} 

				prefix={'all'} 
				styles={styles} 
				timeIndex={props.timeIndex}
				>
					{props.children}
				</TilesGrid>
			</div>
		</div>
	)
}


import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Filler
  } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Tooltip,
	Filler
);

/**
 * @typedef {Object} LabelOptions
 * @property {Number} length
 * @property {'hour' | 'day'} step
 * @property {Object} start
 * 
 * @param {LabelOptions} options 
 * @returns 
 */
const createLabels = (options) => {
	let labelsArray = [];

	for(let i = 0; i < options.length; i++) {
		let time = options.start.add(i, options.step);
		labelsArray.push(time.format('ha'))
	}

	return labelsArray;
}

const hoverLine = {
    id: 'verticalLiner',
    afterInit: (chart, args, opts) => {
      chart.verticalLiner = {}
    },
    afterEvent: (chart, args, options) => {
        const {inChartArea} = args
        chart.verticalLiner = {draw: inChartArea}
    },
    beforeTooltipDraw: (chart, args, options) => {
        const {draw} = chart.verticalLiner
        if (!draw) return

        const {ctx} = chart
        const {top, bottom} = chart.chartArea
        const {tooltip} = args
        const x = tooltip?.caretX
        if (!x) return

        ctx.save()
        
		ctx.strokeStyle = '#FFFFFF';

        ctx.beginPath();
        ctx.moveTo(x, top);
        ctx.lineTo(x, bottom);
        ctx.stroke();
        
        ctx.restore();
    }
}

let limit = 5;
let count = 0;

const drawLine = (chart, text, x, y) => {
	const {ctx} = chart;
	const {top, bottom} = chart.chartArea
	
	ctx.save()
	
	const scale = chart.scales['y'];

	let pos = scale.top + 30;
	let strokeStyle = '#FFFFFF60';

	if (text == 'Max' || text == 'Min') {
		pos = y - 20;
		strokeStyle = '#FFFFFF20'
	}
	
	ctx.strokeStyle = strokeStyle;

	ctx.beginPath();
	ctx.moveTo(x, top);
	ctx.lineTo(x, bottom);
	ctx.stroke();

	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = 'center';

	ctx.fillText(text, x, pos);
	
	ctx.restore();
}

let verticalLinesTimeout;

const drawVerticalLine = {
    id: 'drawVerticalLine',
	afterDraw: function (chart, args, options) {
		if (verticalLinesTimeout) {
			clearTimeout(verticalLinesTimeout);
		}
		verticalLinesTimeout = setTimeout(() => {
			for (let line in options) {
				let pointIndex = options[line].index;
	
				const x = chart.getDatasetMeta(0).data[pointIndex].x;
				const y = chart.getDatasetMeta(0).data[pointIndex].y;
				drawLine(chart, options[line].text, x, y)
			}
		}, 1)
	}
}

const getOrCreateTooltip = (chart) => {
	let tooltipEl = chart.canvas.parentNode.querySelector('div');
  
	if (!tooltipEl) {
	  tooltipEl = document.createElement('div');
	  tooltipEl.classList.add('tooltip')
  
	  const table = document.createElement('table');
	  table.style.margin = '0px';
  
	  tooltipEl.appendChild(table);
	  chart.canvas.parentNode.appendChild(tooltipEl);
	}
  
	return tooltipEl;
  };
  
  const externalTooltipHandler = (context) => {
	// Tooltip Element
	const {chart, tooltip} = context;
	const tooltipEl = getOrCreateTooltip(chart);
  
	// Hide if no tooltip
	if (tooltip.opacity === 0) {
	  tooltipEl.style.opacity = 0;
	  return;
	}
  
	// Set Text
	if (tooltip.body) {
	  const titleLines = tooltip.title || [];
	  const bodyLines = tooltip.body.map(b => b.lines);
  
	  const tableHead = document.createElement('thead');
  
	  titleLines.forEach(title => {
		const tr = document.createElement('tr');
		tr.style.borderWidth = 0;
  
		const th = document.createElement('th');
		th.style.borderWidth = 0;
		const text = document.createTextNode(title);
  
		th.appendChild(text);
		tr.appendChild(th);
		tableHead.appendChild(tr);
	  });
  
	  const tableBody = document.createElement('tbody');
	  bodyLines.forEach((body, i) => {
		const colors = tooltip.labelColors[i];
  
  
		const tr = document.createElement('tr');
		tr.style.backgroundColor = 'inherit';
		tr.style.borderWidth = 0;
		tr.style.textAlign = 'center';
  
		const td = document.createElement('td');
		td.style.borderWidth = 0;
  
		const text = document.createTextNode(body);
  
		td.appendChild(text);
		tr.appendChild(td);
		tableBody.appendChild(tr);
	  });
  
	  const tableRoot = tooltipEl.querySelector('table');
  
	  // Remove old children
	  while (tableRoot.firstChild) {
		tableRoot.firstChild.remove();
	  }
  
	  // Add new children
	  tableRoot.appendChild(tableHead);
	  tableRoot.appendChild(tableBody);
	}
  
	const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;
  
	// Display, position, and set styles for font
	tooltipEl.style.opacity = 1;
	tooltipEl.style.left = positionX + tooltip.caretX + 'px';
	tooltipEl.style.top = 0; // positionY + tooltip.caretY + 'px';
	tooltipEl.style.font = tooltip.options.bodyFont.string;
	tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
};

import { ScrollContainer } from 'react-indiana-drag-scroll'
import 'react-indiana-drag-scroll/dist/style.css';
import { Dayjs } from 'dayjs';

export const ChartTabs = (props) => {
	const { styles } = props;
	const tabsChildren = [];

	for(let datasetLabel of [
		"Measured Temperature",
		"Apparent Temperature",
		"Relative Humidity",
		"Dew Point",
		"Wind Speed",
		"Wind Gusts",
		"Wind Direction",
		"Chance of Rain",
		"Cloud Cover",
		"Visibility",
		"Precipitation",
		"Rain",
		"Showers",
		"Snowfall",
		"Snow Depth",
		"Surface Pressure",		
	]) {

		const active = datasetLabel == 'Measured Temperature';

		const tabElement = (
			<span data-label={datasetLabel} key={nanoid()} className={`${styles['analyze-tab']} ${styles[`analyze-${datasetLabel}`]}${active ? ` ${styles.active}` : null}`}>{datasetLabel}</span>
		)

		tabsChildren.push(tabElement)
	}

	return (
		<ScrollContainer
			className={`${styles['analyze-tab-bar']}`}
		>
			<div className={`${styles['analyze-tabs-grid']}`}>
				{tabsChildren}
			</div>
		</ScrollContainer>
	);
}

/**
 * @typedef {Object} WeatherDataset
 * @property {String} label
 * @property {Array<Number> | Array<String>} data
 * @property {Number} borderWidth
 * @property {Number} tension
 * 
 * @param {WeatherDataset} dataset 
 * @param {Number} endHourIndex 
 */
const sliceChartData = (dataset, endHourIndex=24) => {
	const datasetClone = structuredClone(dataset);
	const slicedData = datasetClone.data.slice(0, endHourIndex);

	datasetClone.data = slicedData;

	return {
		labels: createLabels({
			length: slicedData.length,
			step: 'hour',
			start: dayjs().startOf('day')
		}),
		datasets: [datasetClone]
	}
}

export const ChartElement = (props) => {
	const {weatherDatasets, styles} = props;
    const parentRef = createRef();
    const chartRef = createRef();
	const isFirstRender = useRef(true); 

	//console.log({weatherDatasets})

	const [activeWeatherLabels, setActiveWeatherLabels] = useState(['Measured Temperature'])

    const [chartData, setChartData] = useState(sliceChartData(weatherDatasets['Measured Temperature'], 24));

	const [gridLineColor, setGridLineColor] = useState('');

	/**
	 * 
	 * @param {String} label Weather label
	 * @returns {{min: number, max: number}} Minimum and maximum scale values.
	 */
	const getMinMax = (label) => {
		let max = Math.max(...weatherDatasets[label].data);
		let min = Math.min(...weatherDatasets[label].data);

		switch (label) {
			case 'Measured Temperature':
				if (max >= 80) {
					max = 100;
				} else {
					max = (Math.round(max) + 20)
				}
	
				if (Math.round(min) >= 10) {
					min = (Math.floor((Math.round(min) - 10)/5)*5)
				} else {
					min = 0
				}
				break;
			case 'Precipitation':
			case 'Rain':
				let precipMax = Math.floor(max) + 0.5;
				max = (precipMax);

				min = (0)

				break;
			case 'Visibility':
				let visibilityMax = Math.ceil(max) + 10000;
				max = (visibilityMax);

				break;
			default:
				max = (max + 20);

				if (Math.round(min) >= 10) {
					min = (Math.floor((Math.round(min) - 10)/5)*5)
				} else {
					min = 0;
				}
				break;
		}

		return {
			min,
			max
		}
	}

	const [chartMin, setChartMin] = useState(getMinMax('Measured Temperature').min);
	const [chartMax, setChartMax] = useState(getMinMax('Measured Temperature').max);

	const [chartIdKey, setChartIdKey] = useState('id');

	function labelTabClickHandler (e) {
		const labelClicked = this.dataset.label;

		if (this.classList.contains(styles['active'])) {
			return console.log('already');
		}

		document.querySelector(`.${styles['analyze-tab']}.${styles['active']}`).classList.remove(styles['active'])
		this.classList.add(styles['active'])

		setActiveWeatherLabels([labelClicked])
	}

	function timeFrameTabClickHandler (e) {
		const timeFrameClicked = this.dataset.frame;

		if (this.classList.contains(styles['active'])) {
			return console.log('already');
		}

		document.querySelector(`.${styles['stats-tab']}.${styles['active']}`).classList.remove(styles['active'])
		this.classList.add(styles['active'])

		let endHourIndex = 24;

		if (timeFrameClicked === '48h') {
			endHourIndex = 47;
		} else if (timeFrameClicked === '72h') {
			endHourIndex = 71;
		} else if (timeFrameClicked === '7d') {
			endHourIndex = 167;
		}

		setChartData(sliceChartData(weatherDatasets[activeWeatherLabels[0]], endHourIndex))
	}

	useEffect(() => {
		const labelParent = document.querySelector(`.${styles['analyze-tabs-grid']}`)
		Array.from(labelParent.children).forEach(tab => {
			tab.onclick = labelTabClickHandler;
		})

		const timeFrameParent = document.querySelector(`.${styles['stats-tabs-grid']}`)
		Array.from(timeFrameParent.children).forEach(tab => {
			tab.onclick = timeFrameTabClickHandler;
		})
	})

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
		} else {
			let activeDatasets = []
			activeWeatherLabels.forEach(label => {
				let dataset = weatherDatasets[label];
				activeDatasets.push(dataset)
			})
	
			const idKey = structuredClone(activeWeatherLabels).join('-')
			setChartIdKey(idKey);
	
			//console.log('Setting chart id to: ', activeWeatherLabels.join(''))

			const isSame = activeDatasets.every(dataset => {
				if (chartData.datasets.find(chartDataset => chartDataset.label == dataset.label)) {
					return true;
				} else {
					return false
				}
			}) 

			if (isSame == true) {
				console.log('already')
			} else {
				let activeTimeFrame = 24;
				let frameString = document.querySelector(`.${styles['stats-tab']}.${styles['active']}`).dataset.frame;
				if (frameString === '48h') {
					activeTimeFrame = 47;
				} else if (frameString === '72h') {
					activeTimeFrame = 71;
				} else if (frameString === '7d') {
					activeTimeFrame = 167;
				}

				let newChartData = sliceChartData(weatherDatasets[activeWeatherLabels[0]], activeTimeFrame)
				console.log('setting chart data to', newChartData)
				setChartData(newChartData);

				let { min, max } = getMinMax(activeWeatherLabels[0])
				setChartMin(min)
				setChartMax(max)
			}
		}
	}, [activeWeatherLabels])  

	useEffect(() => {
		const chart = chartRef.current;

		console.log('setting gradient')
	
		if (!chart) {
		  return;
		}
	
		const addedGradientChartData = {
		  ...chartData,
		  datasets: chartData.datasets.map(dataset => ({
			...dataset,
			fill: true,
			backgroundColor: createGradient(chart.ctx, chart.chartArea),
			borderColor: createLineGradient(chart.ctx, chart.chartArea),
			pointBackgroundColor: function(context) {
				let index = context.dataIndex;
				if(index == props.timeIndex) {
					return '#fff';
				}else {
					return 'rgba(0, 0, 0, 0.1)';
				}
			},
			pointBorderColor: '#000',
			pointBorderWidth: 3
		  })),
		};


		setGridLineColor(getComputedStyle(document.body).getPropertyValue('--gridline'))		 

		setChartData(addedGradientChartData);
	  }, []);

	const dataArray = chartData.datasets[0].data;
	let highIndex = dataArray.indexOf(Math.max(...dataArray));
	let lowIndex = dataArray.indexOf(Math.min(...dataArray));

    return (
		<div ref={parentRef} className={styles['chart-parent']}>
			<Line
				ref={chartRef}
				datasetIdKey={chartIdKey}
				data={chartData}
				plugins={[hoverLine, drawVerticalLine]}
				options={{
					maintainAspectRatio: false,
					plugins: {
						legend: {
							display: false
						},
						verticalLiner: {},
						drawVerticalLine: {
							current: {
								index: props.timeIndex,
								text: 'Now'
							},
							max: {
								index: highIndex,
								text: 'Max'
							},
							min: {
								index: lowIndex,
								text: 'Min'
							}
						},
						tooltip: {
							enabled: false,
							position: 'nearest',
							external: externalTooltipHandler,
						}
					},
					layout: {
						padding: {
							left: 10
						}
					},
					interaction: {
						mode: 'index',
						intersect: false,
					},
					animation: {
						duration: 0,
					},
					hover: {
						animationDuration: 0,
					},
					responsive: {
						 
					},
					elements: {
						point: {
							radius: function(context) {
								const dataArray = chartData.datasets[0].data;
								let high = dataArray.indexOf(Math.max(...dataArray));
								let low = dataArray.indexOf( Math.min(...dataArray));

								let index = context.dataIndex;

								if(index == props.timeIndex || index == high || index == low) {
									return 4;
								}else {
									return 0;
								}
							},
							hoverBorderWidth: 1,
							hoverBackgroundColor: '#fff',
							hoverRadius: 7,
						}
					},
					scales: {
						y: {
							grid: {
								color: gridLineColor,
							},
							min: chartMin,
							max: chartMax,
							position: 'right',
							ticks: {
								callback: function(val, index) {
									// Hide every 2nd tick label
									return index % 2 === 0 ? this.getLabelForValue(val) : '';
								},
								color: '#b8aea2',
								font: {
									family: '__Manrope_6e4617',
									weight: 600
								}
							}
						},
						x: {
							grid: {
								color: gridLineColor,
							},
							ticks: {
								font: {
									family: '__Manrope_6e4617',
									weight: 600
								},
								autoSkip: true,
								maxRotation: 0
							}
						}
					}
				}}
			/>
		</div>
    )
}

function createLineGradient(ctx, area) {
	const colorStart = '#006666'
	const colorMid = '#33cc78'
	const colorEnd = '#ff8833'
  
	const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
  
	gradient.addColorStop(0, colorStart);
	gradient.addColorStop(0.5, colorMid);
	gradient.addColorStop(1, colorEnd);
  
	return gradient;
}

function createGradient(ctx, area) {
	const colorStart = '#2d4b48'
	const colorMid = '#2f6f3f'
	const colorEnd = '#af5331'
  
	const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
  
	gradient.addColorStop(0, colorStart);
	gradient.addColorStop(0.5, colorMid);
	gradient.addColorStop(1, colorEnd);

	
  
	return gradient;
}


const getColorFromGradientAtY = (y, colorsArray=['', '', '']) => {
	const color1 = colorsArray[0];
	const color2 = colorsArray[1];
	const color3 = colorsArray[2];

	if (y < 50) {
	  const percentDist = (y / 50);
	  return mixColors(color1, color2, percentDist);
	} else {
	  const percentDist = ((y - 50) / 50);
	  return mixColors(color2, color3, percentDist);
	}
}

  
// helper function to mix two colors based on a percentage
const mixColors = (color1, color2, percent) => {
	const r1 = parseInt(color1.slice(1, 3), 16);
	const g1 = parseInt(color1.slice(3, 5), 16);
	const b1 = parseInt(color1.slice(5, 7), 16);
	const r2 = parseInt(color2.slice(1, 3), 16);
	const g2 = parseInt(color2.slice(3, 5), 16);
	const b2 = parseInt(color2.slice(5, 7), 16);
	const r = Math.round((r1 * (1 - percent) + r2 * percent));
	const g = Math.round((g1 * (1 - percent) + g2 * percent));
	const b = Math.round((b1 * (1 - percent) + b2 * percent));

	return "#" + r.toString(16).padStart(2, "0") + g.toString(16).padStart(2, "0") + b.toString(16).padStart(2, "0");
}
  
// example usage: get the color value at y = 25%
const colorAt25 = getColorFromGradientAtY(50, ['#2d4b48', '#444a35', '#ffa900']);


// RADAR

const mapboxToken = 'pk.eyJ1IjoiaXRzaXNhYWMxOSIsImEiOiJja2xiMmpraTEwZDIyMndvMzE5cGd1eTlyIn0.V2gQnHEAqZEugJKp82pUaQ';

const RainViewerMaps = async () => {
    const mapRequest = await fetch(`https://api.rainviewer.com/public/weather-maps.json`);
    const mapResponse = await mapRequest.json();
    return mapResponse;
};

export const Radar = (props) => {
	const radarElementRef = createRef(); 

	const {latitude, longitude} = props;

	const render = async () => {
		const mapboxgl = (await import('mapbox-gl')).default;
		mapboxgl.accessToken = mapboxToken;

		const mapEndpoints = await RainViewerMaps();

		return [mapboxgl, mapEndpoints]
	}
	const initializeMap = render();
	
	useEffect(() => {
		const check = async () => {
			const [mapboxInstance, endpoints] = await initializeMap;

			const radarElement = radarElementRef.current;
			const Map = new mapboxInstance.Map({
				container: radarElement.id,
				style: "mapbox://styles/mapbox/dark-v10",
				center: [longitude, latitude], // starting position
				minZoom: 4,
				zoom: 4, // starting zoom
				maxZoom: 6,
			})

			const tilesEndpoint = `https://tilecache.rainviewer.com${endpoints.radar.nowcast[0].path}/256/{z}/{x}/{y}/4/1_1.png`;

			Map.on('load', (e) => {
				Map.addSource('raster-tiles', {
					'type': 'raster',
					'tiles': [
						tilesEndpoint
					],
					'tileSize': 256,
					'attribution':  'Map tiles by <a target="_top" rel="noopener" href="https://www.rainviewer.com/api.html"><b>RainViewer</b></a>'
				});

				Map.addLayer(
					{
						'id': 'rain-tiles',
						'type': 'raster',
						'source': 'raster-tiles',
						'minzoom': 0,
						'maxzoom': 15
					}
				);
			})
		}
		check();
	})


    return (<div id={'home-radar'} ref={radarElementRef}></div>);
}


export const ShareButton = (props) => {
	const {styles} = props
	const buttonRef = createRef();

	useEffect(() => {
		buttonRef.current.onclick = async (e) => {
			const URL = window.location.href;

			try {
				await navigator.clipboard.writeText(URL);
				alert(`Copied shareable link to clipboard!`)
				console.log('Content copied to clipboard');
			} catch (err) {
				console.error('Failed to copy: ', err);
			}
		}
	}, [])

	return (
	<button ref={buttonRef} className={`${styles['share-button']}`}>
		Share this weather
	</button>
	)
}