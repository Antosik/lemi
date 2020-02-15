import { Chance } from "chance";

import { mocks } from "../../../__mocks__/SeasonClubAPI.mock";
import { mockSeasonsClubResponse } from "../../../__mocks__/responses/IClub.mock";
import { mockSeasonRewardResponse, mockStageRewardResponse } from "../../../__mocks__/responses/IReward.mock";
import { mockSeasonResponse } from "../../../__mocks__/responses/ISeason.mock";
import { mockSummonerSeasonRatingResponse } from "../../../__mocks__/responses/ISummoner.mock";
import { mockMultiple } from "../../../__mocks__/responses/helpers";

import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

import Season from "../../../../src/models/Season";
import { consts } from "../../../../src/localization";
import { mockPagedResponse } from "../../../__mocks__/responses/IApiCaller";

const chance = new Chance();

describe("Clubs - Season Entity [auth]", () => {
  const api = new ClubsAPIInvoker();

  const season_data = mockSeasonResponse({ is_live: false });
  const season = new Season(season_data, api);

  const season_id = season.season_id;

  test("getClub - Current", async () => {
    const random_club = mockSeasonsClubResponse({ season_id });
    const req = mocks.getSeasonClub(season_id, random_club.club.id)
      .reply(200, random_club);

    const getClubReq = season.getClub(random_club.club.id);

    await expect(getClubReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  test("getClubMembersRating", async () => {
    const rating = mockSummonerSeasonRatingResponse({ season_id });
    const req = mocks.getSeasonClubMembersRating(season_id)
      .reply(200, rating);

    const getClubMembersRatingReq = season.getClubMembersRating();

    await expect(getClubMembersRatingReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  test("getClubSeasonRewards", async () => {
    const rewards = mockMultiple(() => mockSeasonRewardResponse({ season_id }));
    const req = mocks.getSeasonClubRewards(season.season_id)
      .reply(200, rewards);

    const getClubSeasonRewardsReq = season.getClubSeasonRewards();

    await expect(getClubSeasonRewardsReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  test("getClubStagesRewards", async () => {
    const rewards = season.stages.map(({ stage_id }) => mockStageRewardResponse({ stage_id }));
    const req = mocks.getSeasonStagesClubRewards(season.season_id)
      .reply(200, rewards);

    const getClubStagesRewardsReq = season.getClubStagesRewards();

    await expect(getClubStagesRewardsReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  describe("toGetTopN", () => {
    test("Invalid top", async () => {
      const top = chance.natural({ min: 101 });

      const toGetTopNReq = season.toGetTopN(top, { group_size: 5, isARAM: true });

      await expect(toGetTopNReq).rejects.toThrow(consts.invalidTopPosition);
    });

    test("Invalid group size", async () => {
      const top = chance.natural({ min: 2, max: 20 });
      const group_size = chance.bool() ? chance.natural({ min: 5 }) : 1;

      const toGetTopNReq = season.toGetTopN(top, { group_size, isARAM: true });

      await expect(toGetTopNReq).rejects.toThrow(consts.invalidPlayerCount);
    });

    test("Valid arguments", async () => {
      const club = mockSeasonsClubResponse({ season_id });
      const topclubs = mockMultiple(() => mockSeasonsClubResponse({ season_id }));

      const top = chance.natural({ min: 2, max: 500 });
      const group_size = chance.natural({ min: 3, max: 5 });
      const isARAM = chance.bool();

      const topClubsPaged = { per_page: 10, page: Math.ceil(top / 10) };
      mocks.getSeasonClubCurrent(season.season_id).reply(200, club);
      mocks.getSeasonTopClubs(season.season_id).query(topClubsPaged)
        .reply(200, mockPagedResponse(topclubs, topClubsPaged))

      const toGetTopNReq = season.toGetTopN(top, { group_size, isARAM });

      await expect(toGetTopNReq).resolves.toMatchObject({ games_count: expect.any(Number), points_needed: expect.any(Number) });
    });
  });
});