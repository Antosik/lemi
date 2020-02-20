import { Chance } from "chance";

import { mocks } from "../../../mocks/MainClubAPI.mock";
import { mockSeasonsResponse, mockSeasonResponse } from "../../../mocks/responses/ISeason.mock";

import { MainClubAPI } from "../../../../src/clubs-api/components/MainClubAPI";
import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

const chance = new Chance();

describe("clubsAPI - Main API", () => {
  const season_id = chance.natural({ min: 1, max: 1e4 });

  const api = new ClubsAPIInvoker();
  const mainAPI = new MainClubAPI(api);

  it("getSeasons", async () => {
    expect.assertions(2);

    const req = mocks.getSeasons().reply(200, mockSeasonsResponse());

    const mainReq = mainAPI.getSeasons();

    expect(await mainReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getSeason", async () => {
    expect.assertions(2);

    const req = mocks.getSeason(season_id).reply(200, mockSeasonResponse());

    const mainReq = mainAPI.getSeason(season_id);

    expect(await mainReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getLiveSeason", async () => {
    expect.assertions(1);

    mocks.getSeasons().reply(200, mockSeasonsResponse());

    const mainReq = mainAPI.getLiveSeason();

    expect(await mainReq).toBeDefined();
  });
});