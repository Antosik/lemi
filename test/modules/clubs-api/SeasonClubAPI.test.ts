import { SeasonClubAPI } from "../../../src/clubs-api/components/SeasonClubAPI";
import { ClubsAPIInvoker } from "../../../src/clubs-api/helpers/api-invoker";
import { consts } from "../../../src/localization";

import { mocks } from "../../__mocks__/SeasonClubAPI.mock";

describe("ClubsAPI - Season API", () => {
  const stage_id = 83;
  const season_id = 29;
  const club_id = 10875;
  const paged = { page: 1, per_page: 10 };

  describe("without token", () => {
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

    test("getSeasonClub - Current", async () => {
      const req = mocks.getSeasonClubCurrent(season_id).reply(403);

      const seasonReq = stageAPI.getSeasonClub("current");

      await expect(seasonReq).rejects.toThrow(consts.authError);
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

    test("getSeasonClubRewards", async () => {
      const req = mocks.getSeasonClubRewards(season_id).reply(403);

      const seasonReq = stageAPI.getSeasonClubRewards();

      await expect(seasonReq).rejects.toThrow(consts.authError);
      expect(req.isDone()).toBeTruthy();
    })

    test("getSeasonStagesClubRewards", async () => {
      const req = mocks.getSeasonStagesClubRewards(season_id).reply(403);

      const seasonReq = stageAPI.getSeasonStagesClubRewards();

      await expect(seasonReq).rejects.toThrow(consts.authError);
      expect(req.isDone()).toBeTruthy();
    })

    test("getSeasonClubMembersRating", async () => {
      const req = mocks.getSeasonClubMembersRating(season_id).reply(403);

      const seasonReq = stageAPI.getSeasonClubMembersRating();

      await expect(seasonReq).rejects.toThrow(consts.authError);
      expect(req.isDone()).toBeTruthy();
    })
  })
});