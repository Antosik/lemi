import { mocks } from "../../../mocks/SeasonClubAPI.mock";
import { mockSeasonResponse } from "../../../mocks/responses/ISeason.mock";

import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

import Season from "../../../../src/models/Season";
import { consts } from "../../../../src/localization";

describe("clubs - Season Entity [non-auth]", () => {
  const api = new ClubsAPIInvoker();

  const season_data = mockSeasonResponse({ is_live: false });
  const season = new Season(season_data, api);

  it("getClub - Current", async () => {
    expect.assertions(2);

    const req = mocks.getSeasonClubCurrent(season.season_id).reply(403);

    const getClubReq = season.getClub("current");

    await expect(getClubReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getClubMembersRating", async () => {
    expect.assertions(2);

    const req = mocks.getSeasonClubMembersRating(season.season_id)
      .reply(403);

    const getClubMembersRatingReq = season.getClubMembersRating();

    await expect(getClubMembersRatingReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getClubSeasonRewards", async () => {
    expect.assertions(2);

    const req = mocks.getSeasonClubRewards(season.season_id)
      .reply(403);

    const getClubSeasonRewardsReq = season.getClubSeasonRewards();

    await expect(getClubSeasonRewardsReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getClubStagesRewards", async () => {
    expect.assertions(2);

    const req = mocks.getSeasonStagesClubRewards(season.season_id)
      .reply(403);

    const getClubStagesRewardsReq = season.getClubStagesRewards();

    await expect(getClubStagesRewardsReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toStrictEqual(true);
  });

  it("toGetTopN", async () => {
    expect.assertions(1);

    mocks.getSeasonClubCurrent(season.season_id).reply(403);

    const toGetTopNReq = season.toGetTopN(1, { group_size: 5, isARAM: true });

    await expect(toGetTopNReq).rejects.toThrow(consts.authError);
  });
});
