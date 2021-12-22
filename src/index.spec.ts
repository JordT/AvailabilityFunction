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

    it("fetches availability for a space before the space has opened", () => {
      const availability = fetchAvailability(
        space,
        1,
        // new Date(Date.UTC(2020, 8, 7, 15, 22))
        new Date(Date.UTC(2020, 8, 7, 15, 59))

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
