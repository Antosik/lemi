import { Chance } from "chance";

import { mocks } from "../../../mocks/SeasonClubAPI.mock";
import { mockSeasonsClubResponse } from "../../../mocks/responses/IClub.mock";
import { mockSeasonRewardResponse, mockStageRewardResponse } from "../../../mocks/responses/IReward.mock";
import { mockSeasonResponse } from "../../../mocks/responses/ISeason.mock";
import { mockSummonerSeasonRatingResponse } from "../../../mocks/responses/ISummoner.mock";
import { mockMultiple } from "../../../mocks/responses/helpers";

import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

import Season from "../../../../src/models/Season";
import { consts } from "../../../../src/localization";
import { mockPagedResponse } from "../../../mocks/responses/IApiCaller";

const chance = new Chance();

describe("clubs - Season Entity [auth]", () => {
  const api = new ClubsAPIInvoker();

  const season_data = mockSeasonResponse({ is_live: false });
  const season = new Season(season_data, api);

  const season_id = season.season_id;

  it("getClub - Current", async () => {
    expect.assertions(2);

    const random_club = mockSeasonsClubResponse({ season_id });
    const req = mocks.getSeasonClub(season_id, random_club.club.id)
      .reply(200, random_club);

    const getClubReq = season.getClub(random_club.club.id);

    expect(await getClubReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getClubMembersRating", async () => {
    expect.assertions(2);

    const rating = mockSummonerSeasonRatingResponse({ season_id });
    const req = mocks.getSeasonClubMembersRating(season_id)
      .reply(200, rating);

    const getClubMembersRatingReq = season.getClubMembersRating();

    expect(await getClubMembersRatingReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getClubSeasonRewards", async () => {
    expect.assertions(2);

    const rewards = mockMultiple(() => mockSeasonRewardResponse({ season_id }));
    const req = mocks.getSeasonClubRewards(season.season_id)
      .reply(200, rewards);

    const getClubSeasonRewardsReq = season.getClubSeasonRewards();

    expect(await getClubSeasonRewardsReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getClubStagesRewards", async () => {
    expect.assertions(2);

    const rewards = season.stages.map(({ stage_id }) => mockStageRewardResponse({ stage_id }));
    const req = mocks.getSeasonStagesClubRewards(season.season_id)
      .reply(200, rewards);

    const getClubStagesRewardsReq = season.getClubStagesRewards();

    expect(await getClubStagesRewardsReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });

  describe("toGetTopN", () => {
    it("invalid top", async () => {
      expect.assertions(1);

      const top = chance.natural({ min: 101 });

      const toGetTopNReq = season.toGetTopN(top, { group_size: 5, isARAM: true });

      await expect(toGetTopNReq).rejects.toThrow(consts.invalidTopPosition);
    });

    it("invalid group size", async () => {
      expect.assertions(1);

      const top = chance.natural({ min: 2, max: 20 });
      const group_size = chance.natural({ min: 5 });

      const toGetTopNReq = season.toGetTopN(top, { group_size, isARAM: true });

      await expect(toGetTopNReq).rejects.toThrow(consts.invalidPlayerCount);
    });

    it("valid arguments", async () => {
      expect.assertions(1);

      const club = mockSeasonsClubResponse({ season_id });
      const topclubs = mockMultiple(() => mockSeasonsClubResponse({ season_id }));

      const top = chance.natural({ min: 2, max: 500 });
      const group_size = chance.natural({ min: 3, max: 5 });
      const isARAM = chance.bool();

      const topClubsPaged = { per_page: 10, page: Math.ceil(top / 10) };
      mocks.getSeasonClubCurrent(season.season_id).reply(200, club);
      mocks.getSeasonTopClubs(season.season_id).query(topClubsPaged)
        .reply(200, mockPagedResponse(topclubs, topClubsPaged));

      const toGetTopNReq = season.toGetTopN(top, { group_size, isARAM });

      expect(await toGetTopNReq).toMatchObject({ games_count: expect.any(Number), points_needed: expect.any(Number) });
    });
  });
});