import { OpeningTimes, Space } from "./types";

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
  // so we need to return a json object, where the date is a string.
  // and each string has an opening time object

  let availability: Record<string, OpeningTimes> = {}

  // Round current minutes to 15 minute intervals
  const roundTime = (now: Date) => {
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
  }
  roundTime(now)
  // availability[now.getMinutes()] = space.openingTimes[7] //tests the block above

  //display dates correctly
  const formatDates = (d:number) => {
    if (d.toString().length == 1) {
      return `0${d}`
    } else {
      return d
    }
  }

  //display months correctly
  const formatMonths = (d:number) => {
    if (d.toString().length == 1) {
      return `0${d+1}`
    } else {
      return d+1
    }
  }


  // Loop returns day of the week and opening times for those days.
  for (let i: number = 0; i < numberOfDays; i++) {
    let currentDay = now.getDay() + i;
    let currentDate = now.getDate() + i; 
    let returnDate = `${now.getFullYear()}-${formatMonths(now.getMonth())}-${formatDates(currentDate)}`
    
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

