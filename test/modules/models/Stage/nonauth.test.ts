import { Chance } from "chance";

import { mocks } from "../../../mocks/StageClubAPI.mock";
import { mockStageResponse } from "../../../mocks/responses/IStage.mock";

import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

import Stage from "../../../../src/models/Stage";
import { consts } from "../../../../src/localization";

const chance = new Chance();

describe("clubs - Stage Entity [non-auth]", () => {
  const season_id = chance.natural({ max: 15 });
  const paged = { page: 1, per_page: 10 };
  const api = new ClubsAPIInvoker();

  const stage_data = mockStageResponse({ season_id, index: 0, is_live: false });
  const stage = new Stage(stage_data, api);

  const { stage_id } = stage;

  it("getClub", async () => {
    expect.assertions(2);

    const club_id = chance.natural({ max: 1e5 });

    const req = mocks.getStageClub(stage.season_id, club_id).reply(403);
    const getClubReq = stage.getClub(club_id);

    await expect(getClubReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getClubMe", async () => {
    expect.assertions(2);

    const req = mocks.getStageClubMe(stage.season_id, stage_id).reply(403);

    const getClubMeReq = stage.getClubMe();

    await expect(getClubMeReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getClubMembers", async () => {
    expect.assertions(2);

    const req = mocks.getStageClubMembers(stage.season_id, stage_id).query(paged).reply(403);

    const getClubMembersReq = stage.getClubMembers(paged.per_page, paged.page);

    await expect(getClubMembersReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getClubMembersRating", async () => {
    expect.assertions(2);

    const req = mocks.getStageClubMembersRating(stage_id).reply(403);

    const getClubMembersRatingReq = stage.getClubMembersRating();

    await expect(getClubMembersRatingReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getTopN", async () => {
    expect.assertions(2);

    const req = mocks.getStageTopClubs(stage.season_id, stage_id).query(paged).reply(403);

    const getTopNReq = stage.getTopN(paged.per_page, paged.page);

    await expect(getTopNReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toStrictEqual(true);
  });

  it("toGetTopN", async () => {
    expect.assertions(1);

    const top = chance.natural({ min: 1, max: 20 });

    mocks.getStageClubMe(stage.season_id, stage_id).reply(403);
    mocks.getStageTopClubs(stage.season_id, stage_id).query({ ...paged, per_page: top }).reply(403);

    const toGetTopNReq = stage.toGetTopN(top, { group_size: 5, isARAM: true });

    await expect(toGetTopNReq).rejects.toThrow(consts.authError);
  });
});