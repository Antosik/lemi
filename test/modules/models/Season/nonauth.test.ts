import { mocks } from "../../../__mocks__/SeasonClubAPI.mock";
import { mockSeasonResponse } from "../../../__mocks__/responses/ISeason.mock";

import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

import Season from "../../../../src/models/Season";
import { consts } from "../../../../src/localization";

describe("Clubs - Season Entity [non-auth]", () => {
  const api = new ClubsAPIInvoker();

  const season_data = mockSeasonResponse({ is_live: false });
  const season = new Season(season_data, api);

  test("getClub - Current", async () => {
    const req = mocks.getSeasonClubCurrent(season.season_id).reply(403);

    const getClubReq = season.getClub("current");

    await expect(getClubReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toBeTruthy();
  });

  test("getClubMembersRating", async () => {
    const req = mocks.getSeasonClubMembersRating(season.season_id)
      .reply(403);

    const getClubMembersRatingReq = season.getClubMembersRating();

    await expect(getClubMembersRatingReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toBeTruthy();
  });

  test("getClubSeasonRewards", async () => {
    const req = mocks.getSeasonClubRewards(season.season_id)
      .reply(403);

    const getClubSeasonRewardsReq = season.getClubSeasonRewards();

    await expect(getClubSeasonRewardsReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toBeTruthy();
  });

  test("getClubStagesRewards", async () => {
    const req = mocks.getSeasonStagesClubRewards(season.season_id)
      .reply(403);

    const getClubStagesRewardsReq = season.getClubStagesRewards();

    await expect(getClubStagesRewardsReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toBeTruthy();
  });

  test("toGetTopN", async () => {
    mocks.getSeasonClubCurrent(season.season_id).reply(403);

    const toGetTopNReq = season.toGetTopN(1, { group_size: 5, isARAM: true });

    await expect(toGetTopNReq).rejects.toThrow(consts.authError);
  });
});