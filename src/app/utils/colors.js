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
 * 
 * @param {number} temperature 
 * @param {GradientOptionsTemplate} options
 * @returns {string} linear-gradient(155deg, ...), linear-gradient(85deg, ...)
 */
export function generateTemperatureGradient(temperature, options) {
    
    if (temperature < 0) {
        temperature = 0;
    }

    if (temperature >= 110) {
        temperature = 109
    }

    const colorRange = [
        "#264CFF",
        "#3FA0FF",
        "#72D8FF",
        "#AAF7FF",
        "#E0FFFF",
        "#FFFFBF",
        "#FFE099",
        "#FFAD72",
        "#F76D5E",
        "#D82632",
        "#A50021"
      ];
      const rangeSize = colorRange.length - 1;

      const index = Math.floor((temperature / 100) * rangeSize);

      let startIndex = colorRange[index - 1] ?? 0;
      let endIndex = colorRange[index + 1] ?? colorRange[colorRange.length - 1];
    
      const startColor = tinycolor(startIndex);
      const endColor = tinycolor(endIndex);

      if (options?.og) {
        startColor.darken(0)
        endColor.darken(0)

        return `linear-gradient(155deg, ${startColor.toRgbString()} 0%, ${endColor.toRgbString()} 30%, #1B1B1B50 70%), 
        linear-gradient(85deg, ${startColor.spin(0).toRgbString()} 0%, ${endColor.spin(0).toRgbString()} 30%, #1B1B1B50 70%)`;
      }
    
      const percentage = (temperature % 100) / 100;
      const interpolatedColor = interpolateColor(startColor, endColor, percentage);
    
      return `linear-gradient(155deg, ${startColor.toRgbString()} 0%, ${endColor.toRgbString()} 30%, #1B1B1B50 70%), 
      linear-gradient(85deg, ${startColor.spin(0).toRgbString()} 0%, ${endColor.spin(0).toRgbString()} 30%, #1B1B1B50 70%)`;
    }