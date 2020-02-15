import { Chance } from "chance";

import { mocks } from "../../../__mocks__/StageClubAPI.mock";
import { mockPagedResponse } from "../../../__mocks__/responses/IApiCaller";
import { mockStageClubResponse } from "../../../__mocks__/responses/IClub.mock";
import { mockStageSummonerResponse, mockSummonerStageRatingResponse } from "../../../__mocks__/responses/ISummoner.mock";
import { mockMultiple } from "../../../__mocks__/responses/helpers";

import { StageClubAPI } from "../../../../src/clubs-api/components/StageClubAPI";
import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

const chance = new Chance();

describe("ClubsAPI - Stage API [auth]", () => {
  const stage_id = chance.natural({ max: 1e4 });
  const season_id = chance.natural({ max: 1e4 });
  const paged = { page: 1, per_page: 10 };

  const api = new ClubsAPIInvoker();
  const stageAPI = new StageClubAPI(stage_id, season_id, api);

  test("getStageTopClubs", async () => {
    const clubs = mockMultiple(() => mockStageClubResponse({ stage_id }));
    const req = mocks.getStageTopClubs(season_id, stage_id).query(paged)
      .reply(200, mockPagedResponse(clubs, paged));

    const stageReq = stageAPI.getStageTopClubs(paged);

    await expect(stageReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  test("getStageClub", async () => {
    const current_stage = mockStageClubResponse({ stage_id });
    const other_stages = mockMultiple((_, i) => mockStageClubResponse({ stage_id: i }));
    const stages = [...other_stages, current_stage];

    const club_id = current_stage.club.id;
    const req = mocks.getStageClub(season_id, club_id)
      .reply(200, mockPagedResponse(stages));

    const stageReq = stageAPI.getStageClub(club_id);

    await expect(stageReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  test("getStageClubMe", async () => {
    const club = mockStageClubResponse({ stage_id });
    const req = mocks.getStageClubMe(season_id, stage_id).reply(200, club);

    const stageReq = stageAPI.getStageClubMe();

    await expect(stageReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  test("getStageClubMembers", async () => {
    const members = mockMultiple(() => mockStageSummonerResponse({ stage_id }));
    const req = mocks.getStageClubMembers(season_id, stage_id).query(paged)
      .reply(200, mockPagedResponse(members, paged));

    const stageReq = stageAPI.getStageClubMembers(paged);

    await expect(stageReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  test("getStageClubMembersRating", async () => {
    const rating = mockMultiple(() => mockSummonerStageRatingResponse({ stage_id }));
    const req = mocks.getStageClubMembersRating(stage_id).reply(200, rating);

    const stageReq = stageAPI.getStageClubMembersRating();

    await expect(stageReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });
});