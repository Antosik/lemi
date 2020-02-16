import { generateSeasonTime, generateStageTime } from "../../../src/commands/time/text";
import { mockCurrentSeasonResponse } from "../../__mocks__/responses/ISeason.mock";
import { mockSeasonEntity } from "../../__mocks__/entities/ISeason";

import { consts } from "../../../src/localization";

describe("Commands - Time", () => {
  describe("Text generation", () => {
    const season_data = mockCurrentSeasonResponse();
    const live_season = mockSeasonEntity({ season_data });
    const stage = live_season.stages[0];

    describe("Stage", () => {
      test("No active", () => {
        const text = generateStageTime(undefined);
        expect(text).toStrictEqual(consts.noActiveStage);
      })

      test("Active", () => {
        const text = generateStageTime(stage);
        expect(typeof text).toStrictEqual("string");
      });
    });

    describe("Season", () => {
      test("No active", () => {
        const text = generateSeasonTime(undefined);
        expect(text).toStrictEqual(consts.noActiveSeason);
      })

      test("Active", () => {
        const text = generateSeasonTime(live_season);
        expect(typeof text).toStrictEqual("string");
      });
    });
  });
});