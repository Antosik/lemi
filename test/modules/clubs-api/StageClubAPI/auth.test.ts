import { Chance } from "chance";

import { mocks } from "../../../mocks/StageClubAPI.mock";
import { mockPagedResponse } from "../../../mocks/responses/IApiCaller";
import { mockStageClubResponse } from "../../../mocks/responses/IClub.mock";
import { mockStageSummonerResponse, mockSummonerStageRatingResponse } from "../../../mocks/responses/ISummoner.mock";
import { mockMultiple } from "../../../mocks/responses/helpers";

import { StageClubAPI } from "../../../../src/clubs-api/components/StageClubAPI";
import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

const chance = new Chance();

describe("clubsAPI - Stage API [auth]", () => {
  const stage_id = chance.natural({ max: 1e4 });
  const season_id = chance.natural({ max: 1e4 });
  const paged = { page: 1, per_page: 10 };

  const api = new ClubsAPIInvoker();
  const stageAPI = new StageClubAPI(stage_id, season_id, api);

  it("getStageTopClubs", async () => {
    expect.assertions(2);

    const clubs = mockMultiple(() => mockStageClubResponse({ stage_id }));
    const req = mocks.getStageTopClubs(season_id, stage_id).query(paged)
      .reply(200, mockPagedResponse(clubs, paged));

    const stageReq = stageAPI.getStageTopClubs(paged);

    expect(await stageReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getStageClub", async () => {
    expect.assertions(2);

    const current_stage = mockStageClubResponse({ stage_id });
    const other_stages = mockMultiple((_, i) => mockStageClubResponse({ stage_id: i }));
    const stages = [...other_stages, current_stage];

    const club_id = current_stage.club.id;
    const req = mocks.getStageClub(season_id, club_id)
      .reply(200, mockPagedResponse(stages));

    const stageReq = stageAPI.getStageClub(club_id);

    expect(await stageReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getStageClubMe", async () => {
    expect.assertions(2);

    const club = mockStageClubResponse({ stage_id });
    const req = mocks.getStageClubMe(season_id, stage_id).reply(200, club);

    const stageReq = stageAPI.getStageClubMe();

    expect(await stageReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getStageClubMembers", async () => {
    expect.assertions(2);

    const members = mockMultiple(() => mockStageSummonerResponse({ stage_id }));
    const req = mocks.getStageClubMembers(season_id, stage_id).query(paged)
      .reply(200, mockPagedResponse(members, paged));

    const stageReq = stageAPI.getStageClubMembers(paged);

    expect(await stageReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getStageClubMembersRating", async () => {
    expect.assertions(2);

    const rating = mockMultiple(() => mockSummonerStageRatingResponse({ stage_id }));
    const req = mocks.getStageClubMembersRating(stage_id).reply(200, rating);

    const stageReq = stageAPI.getStageClubMembersRating();

    expect(await stageReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });
});