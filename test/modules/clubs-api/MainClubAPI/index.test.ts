import { Chance } from "chance";

import { mocks } from "../../../__mocks__/MainClubAPI.mock";
import { mockSeasonsResponse, mockSeasonResponse } from "../../../__mocks__/responses/ISeason.mock";

import { MainClubAPI } from "../../../../src/clubs-api/components/MainClubAPI";
import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

const chance = new Chance();

describe("ClubsAPI - Main API", () => {
  const season_id = chance.natural({ min: 1, max: 1e4 });

  const api = new ClubsAPIInvoker();
  const mainAPI = new MainClubAPI(api);

  test("getSeasons", async () => {
    const req = mocks.getSeasons().reply(200, mockSeasonsResponse());

    const mainReq = mainAPI.getSeasons();

    await expect(mainReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  test("getSeason", async () => {
    const req = mocks.getSeason(season_id).reply(200, mockSeasonResponse());

    const mainReq = mainAPI.getSeason(season_id);

    await expect(mainReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  test("getLiveSeason", async () => {
    mocks.getSeasons().reply(200, mockSeasonsResponse());

    const mainReq = mainAPI.getLiveSeason();

    await expect(mainReq).resolves.toBeDefined();
  });
});