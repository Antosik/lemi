import { generateSeasonTime, generateStageTime } from "../../../src/commands/time/text";
import { mockCurrentSeasonResponse } from "../../mocks/responses/ISeason.mock";
import { mockSeasonEntity } from "../../mocks/entities/ISeason";

import { consts } from "../../../src/localization";

describe("commands - Time", () => {
  describe("text generation", () => {
    const season_data = mockCurrentSeasonResponse();
    const live_season = mockSeasonEntity({ season_data });
    const stage = live_season.stages[0];

    describe("stage", () => {
      it("no active", () => {
        expect.assertions(1);

        const text = generateStageTime(undefined);
        expect(text).toStrictEqual(consts.noActiveStage);
      });

      it("active", () => {
        expect.assertions(1);

        const text = generateStageTime(stage);
        expect(typeof text).toStrictEqual("string");
      });
    });

    describe("season", () => {
      it("no active", () => {
        expect.assertions(1);

        const text = generateSeasonTime(undefined);
        expect(text).toStrictEqual(consts.noActiveSeason);
      });

      it("active", () => {
        expect.assertions(1);

        const text = generateSeasonTime(live_season);
        expect(typeof text).toStrictEqual("string");
      });
    });
  });
});