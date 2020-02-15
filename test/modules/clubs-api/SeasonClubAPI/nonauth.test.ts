import { Chance } from "chance";

import { mocks } from "../../../__mocks__/SeasonClubAPI.mock";

import { SeasonClubAPI } from "../../../../src/clubs-api/components/SeasonClubAPI";
import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";
import { consts } from "../../../../src/localization";

const chance = new Chance();

describe("ClubsAPI - Season API [non-auth]", () => {
  const season_id = chance.natural({ max: 1e4 });

  const api = new ClubsAPIInvoker();
  const stageAPI = new SeasonClubAPI(season_id, api);

  test("getSeasonClub - Current", async () => {
    const req = mocks.getSeasonClubCurrent(season_id).reply(403);

    const seasonReq = stageAPI.getSeasonClub("current");

    await expect(seasonReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toBeTruthy();
  });

  test("getSeasonClubRewards", async () => {
    const req = mocks.getSeasonClubRewards(season_id).reply(403);

    const seasonReq = stageAPI.getSeasonClubRewards();

    await expect(seasonReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toBeTruthy();
  });

  test("getSeasonStagesClubRewards", async () => {
    const req = mocks.getSeasonStagesClubRewards(season_id).reply(403);

    const seasonReq = stageAPI.getSeasonStagesClubRewards();

    await expect(seasonReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toBeTruthy();
  });

  test("getSeasonClubMembersRating", async () => {
    const req = mocks.getSeasonClubMembersRating(season_id).reply(403);

    const seasonReq = stageAPI.getSeasonClubMembersRating();

    await expect(seasonReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toBeTruthy();
  });
});