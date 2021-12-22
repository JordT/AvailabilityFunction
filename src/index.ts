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
  // availability[dayoftheweek] =  space.openingTimes[now.getDay()] //returns opening hours for the current day...
  //  let dayoftheweek = now.getDate() returns 

  // working code
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

  availability[now.getMinutes()] = space.openingTimes[7]

  // working code


  // Loop returns day of the week and opening times for those days.
  for (let i = 1; i <= numberOfDays; i++) {
    let day = space.openingTimes[i] 

    // get the date and set that to key 
    availability[i.toString()] = day
  }



  return availability;
};
  // Calculate availabilty for the number of days specified in numberOfDays

  // can we slice the space to length?

  // space is going to be an object, with opening times.
  // number of days is how far from now we want to look.

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

