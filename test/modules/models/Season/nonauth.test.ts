import { mocks } from "../../../__mocks__/SeasonClubAPI.mock";
import { mockSeasonsClubResponse } from "../../../__mocks__/responses/IClub.mock";
import { mockSeasonResponse } from "../../../__mocks__/responses/ISeason.mock";

import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

import Season from "../../../../src/models/Season";
import { consts } from "../../../../src/localization";

describe("Clubs - Season Entity - without auth", () => {
  const api = new ClubsAPIInvoker();

  const season_data = mockSeasonResponse({ is_live: false });
  const season = new Season(season_data, api);

  test("getClub - current", async () => {
    const random_club = mockSeasonsClubResponse({ season_id: season.season_id });
    const req = mocks.getSeasonClub(season.season_id, random_club.club.id)
      .reply(200, random_club);

    const getClubReq = season.getClub(random_club.club.id);

    await expect(getClubReq).resolves.toBeDefined();
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

    const toGetTopNReq = season.getClub();

    await expect(toGetTopNReq).rejects.toThrow(consts.authError);
  });
});