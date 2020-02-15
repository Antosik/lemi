import { Chance } from "chance";

import { mocks } from "../../../__mocks__/SeasonClubAPI.mock";

import { SeasonClubAPI } from "../../../../src/clubs-api/components/SeasonClubAPI";
import { mockPagedResponse } from "../../../__mocks__/responses/IApiCaller";
import { mockSeasonsClubResponse } from "../../../__mocks__/responses/IClub.mock";
import { mockMultiple } from "../../../__mocks__/responses/helpers";
import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";
import { mockStageResponse } from "../../../__mocks__/responses/IStage.mock";

const chance = new Chance();

describe("ClubsAPI - Season API", () => {
  const season_id = chance.natural({ max: 1e4 });

  const paged = { page: 1, per_page: 10 };

  const api = new ClubsAPIInvoker();
  const seasonAPI = new SeasonClubAPI(season_id, api);

  test("getSeasonTopClubs", async () => {
    const clubs = mockMultiple(() => mockSeasonsClubResponse({ season_id }));
    const req = mocks.getSeasonTopClubs(season_id).query(paged)
      .reply(200, mockPagedResponse(clubs, paged));

    const seasonReq = seasonAPI.getSeasonTopClubs(paged);

    await expect(seasonReq).resolves.toBeDefined(); // ToDo: Pass data
    expect(req.isDone()).toBeTruthy();
  });

  test("getSeasonClub", async () => {
    const club = mockSeasonsClubResponse({ season_id });
    const club_id = club.club.id;
    const req = mocks.getSeasonClub(season_id, club_id).reply(200);

    const seasonReq = seasonAPI.getSeasonClub(club_id);

    await expect(seasonReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  test("getSeasonStages", async () => {
    const stages = mockMultiple(() => mockStageResponse({ season_id, index: 0, is_live: false }));
    const req = mocks.getSeasonStages(season_id).reply(200, stages);

    const seasonReq = seasonAPI.getSeasonStages();

    await expect(seasonReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  test("getSeasonStageById", async () => {
    const stage = mockStageResponse({ season_id, index: 0, is_live: false });
    const stage_id = stage.id;
    const req = mocks.getSeasonStageById(season_id, stage_id).reply(200, stage);

    const seasonReq = seasonAPI.getSeasonStageById(stage_id);

    await expect(seasonReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });
});