import { OpeningTimes, Space } from "./types";
const { DateTime } = require('luxon');

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
  
  // Create return object
  let availability: Record<string, OpeningTimes> = {}

  // Round current time to next 15 minute interval and adjust for space.minimumNotice
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
  
  if (space.minimumNotice > 0) {
    now.setMinutes(now.getMinutes() + space.minimumNotice)
  }

  // Create Luxon DateTime object 'nowTz' which is 'now' param adjusted for space.timeZone (Tz)
  let zone = space.timeZone
  let nowTz = DateTime.fromJSDate(now, {zone})

  // set variables that iterate in while loop
  let i: number = 0
  let currentDate = nowTz
  let firstDayComplete: boolean = false

  // Loop through dates adding appropriate times/days to 'availability' object
  while (i < numberOfDays) {
    let returnDate = currentDate.toFormat('yyyy-MM-dd')
    let currentDay = currentDate.weekday
    
    // handle first day availability, where we need to consider time of day
    if (firstDayComplete == false) {
      
      // iterate day if no space availability for that weekday
      if (space.openingTimes[currentDay].open == undefined) {
        availability[returnDate] = space.openingTimes[currentDay]
        currentDate = currentDate.plus({days: 1})
        i++;
      } else {
        
        // return first available time for day one
        let currentTimeHour = nowTz.hour
        let currentTimeMinute = nowTz.minute
        let returnTime: OpeningTimes = {
          "open" : {
            "hour": space.openingTimes[currentDay].open!.hour,
            "minute": space.openingTimes[currentDay].open!.minute
          },
          "close": {
            "hour": space.openingTimes[currentDay].close!.hour,
            "minute": space.openingTimes[currentDay].close!.minute
          }
        }

        // Skip to next day if current time is after closing time 
        if(currentTimeHour >= space.openingTimes[currentDay].close!.hour) {
          currentDate = currentDate.plus({days: 1})
          firstDayComplete = true;
          continue;
        }

        // Adjust first availability if current time is after opening time
        if (currentTimeHour >= space.openingTimes[currentDay].open!.hour) {
          returnTime.open!.hour = currentTimeHour
          if (currentTimeMinute > space.openingTimes[currentDay].open!.hour){
            returnTime.open!.minute = currentTimeMinute
          }
        }

        availability[returnDate] = returnTime
        currentDate = currentDate.plus({days: 1})
        i++;
      }
    }

    // Handle all valid days that aren't the first day
    if (firstDayComplete == true && space.openingTimes[currentDay] != undefined) {
      availability[returnDate] = space.openingTimes[currentDay]
      currentDate = currentDate.plus({days : 1})
      i++;
    }

    // iterate 
    if (firstDayComplete == true && space.openingTimes[currentDay] == undefined) {
      currentDate = currentDate.plus({days : 1})
    }
    firstDayComplete = true;
  }
  return availability;
};