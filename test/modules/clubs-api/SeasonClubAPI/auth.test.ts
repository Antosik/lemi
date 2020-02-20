import { Chance } from "chance";

import { mockSeasonsClubResponse } from "../../../mocks/responses/IClub.mock";
import { mocks } from "../../../mocks/SeasonClubAPI.mock";
import { mockSummonerSeasonRatingResponse } from "../../../mocks/responses/ISummoner.mock";
import { mockSeasonRewardResponse, mockStageRewardResponse } from "../../../mocks/responses/IReward.mock";
import { mockMultiple } from "../../../mocks/responses/helpers";

import { SeasonClubAPI } from "../../../../src/clubs-api/components/SeasonClubAPI";
import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

const chance = new Chance();

describe("clubsAPI - Season API [auth]", () => {
  const season_id = chance.natural({ max: 1e4 });

  const api = new ClubsAPIInvoker();
  const stageAPI = new SeasonClubAPI(season_id, api);

  it("getSeasonClub - Current", async () => {
    expect.assertions(2);

    const club = mockSeasonsClubResponse({ season_id });
    const req = mocks.getSeasonClubCurrent(season_id).reply(200, club);

    const seasonReq = stageAPI.getSeasonClub("current");

    expect(await seasonReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getSeasonClubRewards", async () => {
    expect.assertions(2);

    const rewards = mockMultiple(() => mockSeasonRewardResponse({ season_id }));
    const req = mocks.getSeasonClubRewards(season_id).reply(200, rewards);

    const seasonReq = stageAPI.getSeasonClubRewards();

    expect(await seasonReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getSeasonStagesClubRewards", async () => {
    expect.assertions(2);

    const rewards = mockMultiple((_, i) => mockStageRewardResponse({ stage_id: i }));
    const req = mocks.getSeasonStagesClubRewards(season_id).reply(200, rewards);

    const seasonReq = stageAPI.getSeasonStagesClubRewards();

    expect(await seasonReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getSeasonClubMembersRating", async () => {
    expect.assertions(2);

    const rating = mockMultiple(() => mockSummonerSeasonRatingResponse({ season_id }));
    const req = mocks.getSeasonClubMembersRating(season_id).reply(200, rating);

    const seasonReq = stageAPI.getSeasonClubMembersRating();

    expect(await seasonReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });
});