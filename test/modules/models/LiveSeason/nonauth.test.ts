import { Chance } from "chance";

import { mockCurrentSeasonResponse } from "../../../__mocks__/responses/ISeason.mock";

import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

import LiveSeason from "../../../../src/models/LiveSeason";
import { consts } from "../../../../src/localization";

const chance = new Chance();

describe("Clubs - LiveSeason Entity [non-auth]", () => {
  const api = new ClubsAPIInvoker();

  const season_data = mockCurrentSeasonResponse();
  const season = new LiveSeason(season_data, api);

  describe("getStageByIndex", () => {
    test("current", () => {
      const stage = season.getStageByIndex();

      expect(stage).toBeDefined();
    });

    test("not existing", () => {
      const randomId = chance.natural({ min: season.stages.length });

      expect(() => {
        season.getStageByIndex(randomId);
      }).toThrow(consts.stageNotFound);
    });

    test("existing", () => {
      const randomId = chance.natural({ min: 0, max: season.stages.length - 1 });
      const stage = season.getStageByIndex(randomId);

      expect(stage).toBeDefined();
    });
  });
});