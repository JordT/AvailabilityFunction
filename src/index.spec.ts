import * as expect from "expect";
import { fetchAvailability } from "./index";
import { Space } from "./types";

// the end goal
describe("src/index", () => {
  describe("a space with no advance notice", () => {
    let space: Space;
    before(async () => {
      space = await import("../fixtures/space-with-no-advance-notice.json");
    });

    // because of the time zone adjustment, the space is open.
    it("fetches availability for a space before the space has opened", () => {
      const availability = fetchAvailability(
        space,
        1,
        new Date(Date.UTC(2020, 8, 7, 15, 22))
                        // year, month-1, day, 
                        // Mon, 07 Sep 2020 15:22:00 GMT
      );

      expect(availability).toStrictEqual({
        "2020-09-07": {
          open: {
            hour: 11,
            minute: 30,
          },
          close: {
            hour: 17,
            minute: 0,
          },
        },
      });
    });
  });
});

// check multiple days are returned
describe("src/index", () => {
  describe("mutliple dates with no advance notice", () => {
    let space: Space;
    before(async () => {
      space = await import("../fixtures/space-with-no-advance-notice.json");
    });

    it("fetches multiple days of availability for a space before the space has opened", () => {
      const availability = fetchAvailability(
        space,
        2,
        new Date(Date.UTC(2020, 5, 1, 15, 22))
                        // year, month-1, day, 
                        // Mon, 5 June 2020 13:31:00 GMT
      );

      expect(availability).toStrictEqual({
          "2020-06-01": {
            "open": {
              "hour": 11,
              "minute": 30
            },
            "close": {
              "hour": 17,
              "minute": 0
            }
          },
          "2020-06-02": {
            "open" : {
              "hour":9,
              "minute": 0
            },
            "close": {
              "hour": 17,
              "minute": 0
            }
          },
      });
    });
  });
});

// check space.minimumNotice is working
describe("src/index", () => {
  describe("a space with 30 mins advance notice", () => {
    let space: Space;
    before(async () => {
      space = await import("../fixtures/space-with-30-minutes-advance-notice.json");
    });

    it("fetches availability for a space with 30 mins advance notice", () => {
      const availability = fetchAvailability(
        space,
        1,
        new Date(Date.UTC(2020, 8, 7, 15, 22))
                        // year, month-1, day, 
                        // Mon, 07 Sep 2020 15:22:00 GMT
      );

      expect(availability).toStrictEqual({
        "2020-09-07": {
          open: {
            hour: 12,
            minute: 0,
          },
          close: {
            hour: 17,
            minute: 0,
          },
        },
      });
    });
  });
});

// check multiple days are returned
describe("src/index", () => {
  describe("Test 4: mutliple dates with no advance notice, starting on Sunday", () => {
    let space: Space;
    before(async () => {
      space = await import("../fixtures/space-with-no-advance-notice.json");
    });

    it("fetches multiple days of availability starting on a weekend day that's closed", () => {
      const availability = fetchAvailability(
        space,
        3,
        new Date(Date.UTC(2021, 5, 6, 15, 22))
                        // year, month-1, day, 
                        // Sun, 06 Jun 2021 15:22:00 GMT
      );

      expect(availability).toStrictEqual({
          "2021-06-06": {}, // YY-MM-DD
          "2021-06-07": {
            "open" : {
              "hour":9,
              "minute": 0
            },
            "close": {
              "hour": 17,
              "minute": 0
            }
          },
          "2021-06-08": {
            "open" : {
              "hour":9,
              "minute": 0
            },
            "close": {
              "hour": 17,
              "minute": 0
            }
          },
      });
    });
  });
});

// get a full week back
describe("src/index", () => {
  describe("Test 5: mutliple dates with no advance notice", () => {
    let space: Space;
    before(async () => {
      space = await import("../fixtures/space-with-no-advance-notice.json");
    });

    it("fetches multiple days of availability for a space before the space has opened", () => {
      const availability = fetchAvailability(
        space,
        7,
        new Date(Date.UTC(2020, 5, 2, 15, 22))
                        // year, month-1, day, 
                        // Mon, 5 June 2020 13:31:00 GMT
      );

      expect(availability).toStrictEqual({
          "2020-06-02": {
            "open": {
              "hour": 11,
              "minute": 30
            },
            "close": {
              "hour": 17,
              "minute": 0
            }
          },
          "2020-06-03": {
            "open" : {
              "hour":9,
              "minute": 0
            },
            "close": {
              "hour": 17,
              "minute": 0
            }
          },
          "2020-06-04": {
            "open" : {
              "hour":9,
              "minute": 0
            },
            "close": {
              "hour": 17,
              "minute": 0
            }
          },
          "2020-06-05": {
            "open" : {
              "hour":9,
              "minute": 0
            },
            "close": {
              "hour": 17,
              "minute": 0
            }
          },
          "2020-06-06": {},
          "2020-06-07": {},
          "2020-06-08": {
            "open" : {
              "hour":9,
              "minute": 0
            },
            "close": {
              "hour": 17,
              "minute": 0
            }
          }
      });
    });
  });
});

// Check it returns correctly if the time is past that days closing time
describe("src/index", () => {
  describe("the time is later than closing", () => {
    let space: Space;
    before(async () => {
      space = await import("../fixtures/space-with-no-advance-notice.json");
    });

    // because of the time zone adjustment, the space is open.
    it("fetches availability for the next day", () => {
      const availability = fetchAvailability(
        space,
        1,
        new Date(Date.UTC(2020, 8, 7, 22, 22))
                        // year, month-1, day, 
                        // Mon, 07 Sep 2020 22:22:00 GMT
      );

      expect(availability).toStrictEqual({
        "2020-09-08": {
          open: {
            hour: 9,
            minute: 0,
          },
          close: {
            hour: 17,
            minute: 0,
          },
        },
      });
    });
  });
});