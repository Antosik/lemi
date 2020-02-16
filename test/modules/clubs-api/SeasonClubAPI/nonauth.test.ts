import { Chance } from "chance";

import { mocks } from "../../../mocks/SeasonClubAPI.mock";

import { SeasonClubAPI } from "../../../../src/clubs-api/components/SeasonClubAPI";
import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";
import { consts } from "../../../../src/localization";

const chance = new Chance();

describe("clubsAPI - Season API [non-auth]", () => {
  const season_id = chance.natural({ max: 1e4 });

  const api = new ClubsAPIInvoker();
  const stageAPI = new SeasonClubAPI(season_id, api);

  it("getSeasonClub - Current", async () => {
    expect.assertions(2);

    const req = mocks.getSeasonClubCurrent(season_id).reply(403);

    const seasonReq = stageAPI.getSeasonClub("current");

    await expect(seasonReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getSeasonClubRewards", async () => {
    expect.assertions(2);

    const req = mocks.getSeasonClubRewards(season_id).reply(403);

    const seasonReq = stageAPI.getSeasonClubRewards();

    await expect(seasonReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getSeasonStagesClubRewards", async () => {
    expect.assertions(2);

    const req = mocks.getSeasonStagesClubRewards(season_id).reply(403);

    const seasonReq = stageAPI.getSeasonStagesClubRewards();

    await expect(seasonReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getSeasonClubMembersRating", async () => {
    expect.assertions(2);

    const req = mocks.getSeasonClubMembersRating(season_id).reply(403);

    const seasonReq = stageAPI.getSeasonClubMembersRating();

    await expect(seasonReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toStrictEqual(true);
  });
});