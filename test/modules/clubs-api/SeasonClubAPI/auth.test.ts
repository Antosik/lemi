import { Chance } from "chance";

import { mockSeasonsClubResponse } from "../../../__mocks__/responses/IClub.mock";
import { mocks } from "../../../__mocks__/SeasonClubAPI.mock";
import { mockSummonerSeasonRatingResponse } from "../../../__mocks__/responses/ISummoner.mock";
import { mockSeasonRewardResponse, mockStageRewardResponse } from "../../../__mocks__/responses/IReward.mock";
import { mockMultiple } from "../../../__mocks__/responses/helpers";

import { SeasonClubAPI } from "../../../../src/clubs-api/components/SeasonClubAPI";
import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

const chance = new Chance();

describe("ClubsAPI - Season API [auth]", () => {
  const season_id = chance.natural({ max: 1e4 });

  const api = new ClubsAPIInvoker();
  const stageAPI = new SeasonClubAPI(season_id, api);

  test("getSeasonClub - Current", async () => {
    const club = mockSeasonsClubResponse({ season_id });
    const req = mocks.getSeasonClubCurrent(season_id).reply(200, club);

    const seasonReq = stageAPI.getSeasonClub("current");

    await expect(seasonReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  test("getSeasonClubRewards", async () => {
    const rewards = mockMultiple(() => mockSeasonRewardResponse({ season_id }));
    const req = mocks.getSeasonClubRewards(season_id).reply(200, rewards);

    const seasonReq = stageAPI.getSeasonClubRewards();

    await expect(seasonReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  test("getSeasonStagesClubRewards", async () => {
    const rewards = mockMultiple((_, i) => mockStageRewardResponse({ stage_id: i }));
    const req = mocks.getSeasonStagesClubRewards(season_id).reply(200, rewards);

    const seasonReq = stageAPI.getSeasonStagesClubRewards();

    await expect(seasonReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  test("getSeasonClubMembersRating", async () => {
    const rating = mockMultiple(() => mockSummonerSeasonRatingResponse({ season_id }));
    const req = mocks.getSeasonClubMembersRating(season_id).reply(200, rating);

    const seasonReq = stageAPI.getSeasonClubMembersRating();

    await expect(seasonReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });
});