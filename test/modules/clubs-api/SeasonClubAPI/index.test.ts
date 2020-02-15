import { Chance } from "chance";

import { mocks } from "../../../__mocks__/SeasonClubAPI.mock";

import { SeasonClubAPI } from "../../../../src/clubs-api/components/SeasonClubAPI";
import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

const chance = new Chance();

describe("ClubsAPI - Season API", () => {
  const stage_id = chance.natural({ max: 1e4 });
  const season_id = chance.natural({ max: 1e4 });
  const club_id = chance.natural({ max: 1e6 });

  const paged = { page: 1, per_page: 10 };

  const api = new ClubsAPIInvoker();
  const stageAPI = new SeasonClubAPI(season_id, api);

  test("getSeasonTopClubs", async () => {
    const req = mocks.getSeasonTopClubs(season_id).query(paged).reply(200);

    const seasonReq = stageAPI.getSeasonTopClubs(paged);

    await expect(seasonReq).resolves.toBeUndefined(); // ToDo: Pass data
    expect(req.isDone()).toBeTruthy();
  })

  test("getSeasonClub", async () => {
    const req = mocks.getSeasonClub(season_id, club_id).reply(200);

    const seasonReq = stageAPI.getSeasonClub(club_id);

    await expect(seasonReq).resolves.toContain(""); // ToDo: Pass data
    expect(req.isDone()).toBeTruthy();
  })

  test("getSeasonStages", async () => {
    const req = mocks.getSeasonStages(season_id).reply(200);

    const seasonReq = stageAPI.getSeasonStages();

    await expect(seasonReq).resolves.toContain(""); // ToDo: Pass data
    expect(req.isDone()).toBeTruthy();
  })

  test("getSeasonStageById", async () => {
    const req = mocks.getSeasonStageById(season_id, stage_id).reply(200);

    const seasonReq = stageAPI.getSeasonStageById(stage_id);

    await expect(seasonReq).resolves.toContain(""); // ToDo: Pass data
    expect(req.isDone()).toBeTruthy();
  })
});