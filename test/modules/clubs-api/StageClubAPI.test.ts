import { StageClubAPI } from "../../../src/clubs-api/components/StageClubAPI";
import { ClubsAPIInvoker } from "../../../src/clubs-api/helpers/api-invoker";
import { consts } from "../../../src/localization";

import { mocks } from "../../__mocks__/StageClubAPI.mock";

describe("ClubsAPI - Stage API", () => {
  const stage_id = 83;
  const season_id = 29;
  const club_id = 10875;
  const paged = { page: 1, per_page: 10 };

  describe("without token", () => {
    const api = new ClubsAPIInvoker();
    const stageAPI = new StageClubAPI(stage_id, season_id, api);

    test("getStageTopClubs", async () => {
      const req = mocks.getStageTopClubs(season_id, stage_id).query(paged).reply(403);

      const stageReq = stageAPI.getStageTopClubs(paged);

      await expect(stageReq).rejects.toThrow(consts.authError);
      expect(req.isDone()).toBeTruthy();
    })

    test("getStageClub", async () => {
      const req = mocks.getStageClub(season_id, club_id).reply(403);

      const stageReq = stageAPI.getStageClub(club_id);

      await expect(stageReq).rejects.toThrow(consts.authError);
      expect(req.isDone()).toBeTruthy();
    })

    test("getStageClubMe", async () => {
      const req = mocks.getStageClubMe(season_id, stage_id).reply(403);

      const stageReq = stageAPI.getStageClubMe();

      await expect(stageReq).rejects.toThrow(consts.authError);
      expect(req.isDone()).toBeTruthy();
    })

    test("getStageClubMembers", async () => {
      const req = mocks.getStageClubMembers(season_id, stage_id).query(paged).reply(403);

      const stageReq = stageAPI.getStageClubMembers(paged);

      await expect(stageReq).rejects.toThrow(consts.authError);
      expect(req.isDone()).toBeTruthy();
    })

    test("getStageClubMembersRating", async () => {
      const req = mocks.getStageClubMembersRating(stage_id).reply(403);

      const stageReq = stageAPI.getStageClubMembersRating();

      await expect(stageReq).rejects.toThrow(consts.authError);
      expect(req.isDone()).toBeTruthy();
    })
  })
});