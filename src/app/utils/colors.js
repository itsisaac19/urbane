import tinycolor from "tinycolor2";

function interpolateColor(startColor, endColor, percentage) {
    const startRgb = startColor.toRgb();
    const endRgb = endColor.toRgb();
  
    const result = {
      r: interpolate(startRgb.r, endRgb.r, percentage),
      g: interpolate(startRgb.g, endRgb.g, percentage),
      b: interpolate(startRgb.b, endRgb.b, percentage)
    };
  
    return tinycolor(result);
  }
  
  function interpolate(start, end, percentage) {
    return Math.floor(start + (end - start) * percentage);
  }

/**
 * @typedef GradientOptionsTemplate
 * @property {boolean} [og=false] og is for an Open Graph image.
 * @property {string} [units='imperial'] unit string.
 * @property {boolean} [night=false] whether or not it is nighttime.
 * 
 * @param {number} temperature 
 * @param {GradientOptionsTemplate} options
 * @returns {string} linear-gradient(155deg, ...), linear-gradient(85deg, ...)
 */
export function generateTemperatureGradient(temperature, options) {
    let range = {
      min: -50,
      max: 110,
      value: 150,
    };

    if (options.units == 'metric') {
      range = {
        min: -45,
        max: 45,
        value: 90,
      };
    }

    if (temperature < range.min) temperature = range.min;
    if (temperature > range.max) temperature = range.max;


    let colorRange = [
        "#264CFF",
        "#3FA0FF",
        "#72D8FF",
        "#AAF7FF",
        "#00B8B8",
        "#CCCC00",
        "#E29D2F",
        "#DD7124",
        "#F76D5E",
        "#D82632",
        "#A50021"
    ];

    if (options.night) {
      colorRange = [
        "#283D3B",
        "#115055",
        "#28737b",
        "#56684E",
        "#3F5946",
        "#6D6237",
        "#835C20",
        "#74401B",
        "#6D3218",
        "#652415",
        "#4D050D"
      ]
    }

    const stepSize = range.value / colorRange.length;
    const tempShiftedToMin = temperature - range.min;

    const index = Math.floor(tempShiftedToMin / stepSize);

    let startIndex = colorRange[index - 1] ?? 0;
    let endIndex = colorRange[index + 1] ?? colorRange[colorRange.length - 1];
  
    const startColor = tinycolor(startIndex);
    const endColor = tinycolor(endIndex);
    
    if (options.night) {

    } else {
      startColor.darken(20)
    }

    if (options?.og) {
      endColor.darken(0)

      //return `linear-gradient(0deg, ${startColor.spin(0).toRgbString()}, transparent),linear-gradient(to top left, ${endColor.spin(0).toRgbString()}, transparent), linear-gradient(to top right, ${endColor.spin(30).toRgbString()}, transparent)`;

      return `linear-gradient(to bottom right, ${startColor.toRgbString()}, ${endColor.spin(130).darken(20).setAlpha(0.25).toRgbString()}), 
      linear-gradient(to top right, #000, ${endColor.spin(100).toRgbString()}), url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIj4NCiAgICA8ZmlsdGVyIGlkPSJub2lzZSIgeD0iMCIgeT0iMCI+DQogICAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPg0KICAgICAgPGZlQmxlbmQgbW9kZT0ic2NyZWVuIi8+DQogICAgPC9maWx0ZXI+DQogICAgPHJlY3Qgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjEiLz4NCjwvc3ZnPg==)`;
    }

    //if (startColor.getBrightness() > 95) startColor.darken(70);
    //if (endColor.getBrightness() > 95) endColor.darken(60);
  
    const percentage = (temperature % 100) / 100;
    const interpolatedColor = interpolateColor(startColor, endColor, percentage);
  
    return `
    linear-gradient(to bottom right, ${startColor.spin(0).toRgbString()}, ${endColor.spin(130).darken(20).setAlpha(0.25).toRgbString()}),     
    linear-gradient(to top right, #000000b3, ${endColor.spin(100).toRgbString()}),
    url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MDAiIGhlaWdodD0iNTAwIj4NCiAgICA8ZmlsdGVyIGlkPSJub2lzZSIgeD0iMCIgeT0iMCI+DQogICAgICA8ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPg0KICAgICAgPGZlQmxlbmQgbW9kZT0ic2NyZWVuIi8+DQogICAgPC9maWx0ZXI+DQogICAgPHJlY3Qgd2lkdGg9IjUwMCIgaGVpZ2h0PSI1MDAiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjEiLz4NCjwvc3ZnPg==)
    `;
    }