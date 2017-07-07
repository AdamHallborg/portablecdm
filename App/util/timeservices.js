import userConfig, { timeDisplayModes } from '../config/userconfig';


  // TODO: tiderna blir fel!, den antar UTC eller nåt!

/**
 * 
 * @param {Date} date 
 *  Date object, representing the DateTime in UTC
 */
export function getDateString(date) {
  if(userConfig.timeDisplayMode === timeDisplayModes.local) {
    return date.getTime() === new Date(null).getTime() ? '' : `${date.toLocaleDateString()}`;
    // return `${date.toLocaleDateString()}`;
  }
}

/**
 * 
 * @param {Date} date 
 *  Date object, representing the DateTime in UTC
 */
export function getTimeString(date) {

  if(userConfig.timeDisplayMode === timeDisplayModes.local) {
    return date.getTime() === new Date(null).getTime() ? '??' : `${date.toLocaleTimeString().slice(0, 5)}`;
  }
}

/**
 * 
 * @param {Date} date 
 *  Date object, representing the DateTime in UTC
 */
export function getDateTimeString(date) {
  if(userConfig.timeDisplayMode === timeDisplayModes.local) {
    let onlyDate = date.toLocaleDateString();
    let onlyTime = date.toLocaleTimeString();
    return `${onlyDate} ${onlyTime}`;
  } else if (userConfig.timeDisplayMode === timeDisplayModes.local) {
    return date.toUTCString();
  }
}

/** Gets a string that says how many seconds, minutes or hours ago
 *  a date was
 * 
 * @param {Date} time 
 *  A time in the past, to compare with the time now
 */
export function getTimeDifferenceString(time) {
  let timeDif = new Date() - time;
  timeDif = timeDif / 1000; // seconds
 
  if(timeDif < 60) {
    return `${Math.floor(timeDif)} sec`;
  }
  
  timeDif = timeDif / 60; // minutes
  if(timeDif < 60) {
    return `${Math.floor(timeDif)} min`;
  }

  timeDif = timeDif / 60; // hours
  return `${Math.floor(timeDif)}h`;
}