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
  // calculate days in space to go forward with...
  let availability: Record<string, OpeningTimes> = {}
// get space into availability, then we can return availability
  let dayoftheweek = now.getDay() // returnsdate as a string
//  let dayoftheweek = now.getDate() returns 
  // availability[test] =  space.openingTimes
  availability[dayoftheweek] =  space.openingTimes[now.getDay()]

  
  // let availability: Record<string, OpeningTimes> = {}
  // // get current day, then pull data if theres availability on that day.
  // for (let i = 0; i < numberOfDays; i++) {
  //   let day = space.openingTimes[i.toString()] //loop through and get each openingtimes.
  //   availability[i.toString()] = day
  // }


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

