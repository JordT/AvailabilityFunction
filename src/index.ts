import { OpeningTimes, Space } from "./types";
var moment = require('moment-timezone');

/**
 * Fetches upcoming availability for a space
 * @param space The space to fetch the availability for
 * @param numberOfDays The number of days from `now` to fetch availability for
 * @param now The time now
 */
export const fetchAvailability = (
  space: Space,
  numberOfDays: number,
  now: Date
): Record<string, OpeningTimes> => {
  // Your implementation here ************
  let availability: Record<string, OpeningTimes> = {}

  // adjust 'now' Date object to the timezone specified in space object
  let getTimeZoneOffset = moment(now).tz(space.timeZone).format('ZZ') //get timezone offset
  now = moment(now).utcOffset(getTimeZoneOffset).format('YYYY-MM-DD hh:mm') // apply timezone offset
  now = moment(now).toDate();   //convert moment wrapper back to a JS Date Object (we could refactor to moment throughout...)

  // Round current minutes to 15 minute intervals
  const adjustTime = (now: Date) => {
    // availability[now.toString()] = {}
    if (now.getMinutes() != 0 || 15 || 30 || 45){
      if (now.getMinutes() < 15) {
        now.setMinutes(15)
      } 
      else if (now.getMinutes() < 30) {
        now.setMinutes(30)
      } else if(now.getMinutes() < 45) {
        now.setMinutes(45)
      } else if (now.getMinutes() <= 59) {
        now.setMinutes(0)
        now.setHours(now.getHours() + 1)
      }
    }
    // adjust current time for timezone -- use this codeee boiiiiii
    // let getTimeZoneOffset = moment(now).tz(space.timeZone).format('ZZ')
    // now = moment(now).utcOffset(getTimeZoneOffset).format('YYYY-MM-DD hh:mm') 
    // availability[now.toString()] = {} // test now works
  }
  adjustTime(now)  // availability[now.getMinutes()] = space.openingTimes[7] //tests the block above

  const formatDates = (d:number) => {   //display dates correctly
    if (d.toString().length == 1) {
      return `0${d}`
    } else {
      return d
    }
  }

  const formatMonths = (d:number) => {   //display dates correctly
    if (d.toString().length == 1) {
      return `0${d+1}`
    } else {
      return d+1
    }
  }
  // we only need to consider opening times on day 1?

  // Loop returns day of the week and opening times for those days.
  for (let i: number = 0; i < numberOfDays; i++) {
    let currentDay = now.getDay() + i;
    let currentDate = now.getDate() + i;
    let returnDate = `${now.getFullYear()}-${formatMonths(now.getMonth())}-${formatDates(currentDate)}`

    // we need to access the js object... this is how we access the times... they need to be all defined wiht a type check?
    let currentTimeHour = now.getHours()
    let currentTimeMinute = now.getMinutes()
    let openingTimeHour = space.openingTimes[currentDay].open?.hour
    let openingTimeMinute = space.openingTimes[currentDay].open?.minute
    let closingTimeHour = space.openingTimes[currentDay].close?.hour
    let closingTimeMinute = space.openingTimes[currentDay].close?.minute

    if (typeof openingTimeHour === 'number' && typeof openingTimeMinute === 'number') {
      //currenttime is in milliseconds ree.
      if (currentTimeHour >= openingTimeHour && currentTimeMinute >= openingTimeMinute) {
        availability[currentTimeHour.toString()] = space.openingTimes[currentDay] 
      }
    }

    // ***
    availability[returnDate] = space.openingTimes[currentDay]
  }

  return availability;
};

// Calculate availabilty for the number of days specified in numberOfDays

// Don't return times that in the past relative to 'now'

//return available times in increments of 15 minutes

// Take in account the space.minimumNotice period

// return opening times relative to the 'space.timeZone'


// return object example json
// {
//   "2020-06-06": {
//     "open": {
//       "hour": 9,
//       "minute": 0
//     },
//     "close": {
//       "hour": 17,
//       "minute": 0
//     }
//   },
//   "2020-06-07": {}
// }

