import { Chance } from "chance";

import { mocks } from "../../../mocks/SeasonClubAPI.mock";

import { SeasonClubAPI } from "../../../../src/clubs-api/components/SeasonClubAPI";
import { mockPagedResponse } from "../../../mocks/responses/IApiCaller";
import { mockSeasonsClubResponse } from "../../../mocks/responses/IClub.mock";
import { mockMultiple } from "../../../mocks/responses/helpers";
import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";
import { mockStageResponse } from "../../../mocks/responses/IStage.mock";

const chance = new Chance();

describe("clubsAPI - Season API", () => {
  const season_id = chance.natural({ max: 1e4 });

  const paged = { page: 1, per_page: 10 };

  const api = new ClubsAPIInvoker();
  const seasonAPI = new SeasonClubAPI(season_id, api);

  it("getSeasonTopClubs", async () => {
    expect.assertions(2);

    const clubs = mockMultiple(() => mockSeasonsClubResponse({ season_id }));
    const req = mocks.getSeasonTopClubs(season_id).query(paged)
      .reply(200, mockPagedResponse(clubs, paged));

    const seasonReq = seasonAPI.getSeasonTopClubs(paged);

    expect(await seasonReq).toBeDefined(); // ToDo: Pass data
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getSeasonClub", async () => {
    expect.assertions(2);

    const club = mockSeasonsClubResponse({ season_id });
    const club_id = club.club.id;
    const req = mocks.getSeasonClub(season_id, club_id).reply(200);

    const seasonReq = seasonAPI.getSeasonClub(club_id);

    expect(await seasonReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getSeasonStages", async () => {
    expect.assertions(2);

    const stages = mockMultiple(() => mockStageResponse({ season_id, index: 0, is_live: false }));
    const req = mocks.getSeasonStages(season_id).reply(200, stages);

    const seasonReq = seasonAPI.getSeasonStages();

    expect(await seasonReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getSeasonStageById", async () => {
    expect.assertions(2);

    const stage = mockStageResponse({ season_id, index: 0, is_live: false });
    const stage_id = stage.id;
    const req = mocks.getSeasonStageById(season_id, stage_id).reply(200, stage);

    const seasonReq = seasonAPI.getSeasonStageById(stage_id);

    expect(await seasonReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });
});