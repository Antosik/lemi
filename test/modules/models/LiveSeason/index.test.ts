import { Chance } from "chance";

import { mockCurrentSeasonResponse } from "../../../mocks/responses/ISeason.mock";

import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

import LiveSeason from "../../../../src/models/LiveSeason";
import { consts } from "../../../../src/localization";

const chance = new Chance();

describe("clubs - LiveSeason Entity [non-auth]", () => {
  const api = new ClubsAPIInvoker();

  const season_data = mockCurrentSeasonResponse();
  const season = new LiveSeason(season_data, api);

  describe("getStageByIndex", () => {
    it("current", () => {
      expect.assertions(1);

      const stage = season.getStageByIndex();

      expect(stage).toBeDefined();
    });

    it("not existing", () => {
      expect.assertions(1);

      const randomId = chance.natural({ min: season.stages.length });

      expect(() => {
        season.getStageByIndex(randomId);
      }).toThrow(consts.stageNotFound);
    });

    it("existing", () => {
      expect.assertions(1);

      const randomId = chance.natural({ min: 0, max: season.stages.length - 1 });
      const stage = season.getStageByIndex(randomId);

      expect(stage).toBeDefined();
    });
  });
});