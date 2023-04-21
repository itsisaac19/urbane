/**
 * 
 * @param {Function} fn 
 * @returns {number} 
 */
export function runAtTrueMinute(fn) {
    const now = new Date();
    const seconds = now.getSeconds();
    const milliseconds = now.getMilliseconds();
  
    // Calculate the remaining time until the next true minute
    const remainingMilliseconds = (60 - seconds - 1) * 1000 + (1000 - milliseconds);
  
    // Call the function passed in as an argument after the remaining time has elapsed
    const timeoutId = setTimeout(() => {
      fn();
      runAtTrueMinute(fn);
    }, remainingMilliseconds);
  
    return timeoutId;
}