import { Chance } from "chance";

import { mocks } from "../../../mocks/StageClubAPI.mock";

import { StageClubAPI } from "../../../../src/clubs-api/components/StageClubAPI";
import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";
import { consts } from "../../../../src/localization";

const chance = new Chance();

describe("clubsAPI - Stage API [non-auth]", () => {
  const stage_id = chance.natural({ max: 1e4 });
  const season_id = chance.natural({ max: 1e4 });
  const club_id = chance.natural({ max: 1e6 });
  const paged = { page: 1, per_page: 10 };

  const api = new ClubsAPIInvoker();
  const stageAPI = new StageClubAPI(stage_id, season_id, api);

  it("getStageTopClubs", async () => {
    expect.assertions(2);

    const req = mocks.getStageTopClubs(season_id, stage_id).query(paged).reply(403);

    const stageReq = stageAPI.getStageTopClubs(paged);

    await expect(stageReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getStageClub", async () => {
    expect.assertions(2);

    const req = mocks.getStageClub(season_id, club_id).reply(403);

    const stageReq = stageAPI.getStageClub(club_id);

    await expect(stageReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getStageClubMe", async () => {
    expect.assertions(2);

    const req = mocks.getStageClubMe(season_id, stage_id).reply(403);

    const stageReq = stageAPI.getStageClubMe();

    await expect(stageReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getStageClubMembers", async () => {
    expect.assertions(2);

    const req = mocks.getStageClubMembers(season_id, stage_id).query(paged).reply(403);

    const stageReq = stageAPI.getStageClubMembers(paged);

    await expect(stageReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getStageClubMembersRating", async () => {
    expect.assertions(2);

    const req = mocks.getStageClubMembersRating(stage_id).reply(403);

    const stageReq = stageAPI.getStageClubMembersRating();

    await expect(stageReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toStrictEqual(true);
  });
});