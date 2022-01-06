import { open } from "fs";
import { OpeningTimes, Space, Time } from "./types";
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

  // Round current minutes to next 15 minute interval and account for space.minimumNotice if provided
  const adjustTime = (now: Date) => {

    // Round time to next 15 minute interval
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

    // Adjust for space.minimumNotice
    if (space.minimumNotice != 0) {
      now.setMinutes(now.getMinutes() + space.minimumNotice)
    }

  }
  adjustTime(now)

  const formatDates = (d:number) => {   //display dates correctly
    if (d.toString().length == 1) {
      return `0${d}`
    } else {
      return d
    }
  }

  const formatMonths = (d:number) => {   //display dates correctly - adjust for zero index
    if (d.toString().length == 1) {
      return `0${d+1}`
    } else {
      return d+1
    }
  }
  


  // Loop returns day of the week and opening times for those days
  // first day is handled seperately within the loop -- clunky?
  for (let i: number = 0; i < numberOfDays; i++) {
    let currentDay = now.getDay() + i;
    let currentDate = now.getDate() + i;
    let returnDate = `${now.getFullYear()}-${formatMonths(now.getMonth())}-${formatDates(currentDate)}`

    // we need to only loop on the first day
    if (i == 0) {
      let currentTimeHour = now.getHours()
      let currentTimeMinute = now.getMinutes()

      let returnTime: OpeningTimes = space.openingTimes[currentDay] 
      if (currentTimeHour > returnTime.open!.hour) {
        
        returnTime.open!.hour = currentTimeHour

        if (currentTimeMinute > returnTime.open!.minute) {

          returnTime.open!.minute = currentTimeMinute

        }
      }
      availability[returnDate] = returnTime
    }

    // return remaining days
    if (i >= 1) {
      availability[returnDate] = space.openingTimes[currentDay]
    }
  }
  
  // return availability Record
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

