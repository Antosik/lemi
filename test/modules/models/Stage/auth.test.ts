import { Chance } from "chance";

import { mocks } from "../../../mocks/StageClubAPI.mock";
import { mockPagedResponse } from "../../../mocks/responses/IApiCaller";
import { mockStageClubResponse } from "../../../mocks/responses/IClub.mock";
import { mockStageResponse } from "../../../mocks/responses/IStage.mock";
import { mockStageSummonerResponse, mockSummonerStageRatingResponse } from "../../../mocks/responses/ISummoner.mock";
import { mockMultiple } from "../../../mocks/responses/helpers";

import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

import Stage from "../../../../src/models/Stage";
import { consts } from "../../../../src/localization";

const chance = new Chance();

describe("clubs - Stage Entity [auth]", () => {
  const season_id = chance.natural({ max: 15 });
  const paged = { page: 1, per_page: 10 };
  const api = new ClubsAPIInvoker();

  const stage_data = mockStageResponse({ season_id, index: 0, is_live: false });
  const stage = new Stage(stage_data, api);

  const { stage_id } = stage;

  it("getClub", async () => {
    expect.assertions(2);

    const current_stage = mockStageClubResponse({ stage_id });
    const other_stages = mockMultiple((_, i) => mockStageClubResponse({ stage_id: i }));
    const stages = [...other_stages, current_stage];

    const club_id = current_stage.club.id;
    const req = mocks.getStageClub(season_id, club_id)
      .reply(200, mockPagedResponse(stages));

    const getClubReq = stage.getClub(club_id);

    expect(await getClubReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getClubMe", async () => {
    expect.assertions(2);

    const club = mockStageClubResponse({ stage_id });
    const req = mocks.getStageClubMe(stage.season_id, stage_id).reply(200, club);

    const getClubMeReq = stage.getClubMe();

    expect(await getClubMeReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getClubMembers", async () => {
    expect.assertions(2);

    const members = mockMultiple(() => mockStageSummonerResponse({ stage_id }));
    const req = mocks.getStageClubMembers(stage.season_id, stage_id).query(paged)
      .reply(200, mockPagedResponse(members, paged));

    const getClubMembersReq = stage.getClubMembers(paged.per_page, paged.page);

    expect(await getClubMembersReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getClubMembersRating", async () => {
    expect.assertions(2);

    const rating = mockMultiple(() => mockSummonerStageRatingResponse({ stage_id }));
    const req = mocks.getStageClubMembersRating(stage_id).reply(200, rating);

    const getClubMembersRatingReq = stage.getClubMembersRating();

    expect(await getClubMembersRatingReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });

  it("getTopN", async () => {
    expect.assertions(1);

    const clubs = mockMultiple(() => mockStageClubResponse({ stage_id }));
    mocks.getStageTopClubs(stage.season_id, stage_id).query(paged)
      .reply(200, mockPagedResponse(clubs, paged));

    const getTopNReq = stage.getTopN(paged.per_page, paged.page);

    expect(await getTopNReq).toBeDefined();
  });

  describe("toGetTopN", () => {
    it("invalid top", async () => {
      expect.assertions(1);

      const top = chance.natural({ min: 26 });

      const toGetTopNReq = stage.toGetTopN(top, { group_size: 5, isARAM: true });

      await expect(toGetTopNReq).rejects.toThrow(consts.invalidTopPosition);
    });

    it("invalid group size", async () => {
      expect.assertions(1);

      const top = chance.natural({ min: 2, max: 20 });
      const group_size = chance.natural({ min: 5 });

      const toGetTopNReq = stage.toGetTopN(top, { group_size, isARAM: true });

      await expect(toGetTopNReq).rejects.toThrow(consts.invalidPlayerCount);
    });

    describe("valid arguments", () => {
      const top = chance.natural({ min: 2, max: 25 });
      const group_size = chance.natural({ min: 3, max: 5 });
      const isARAM = chance.bool();

      const club = mockStageClubResponse({ stage_id });
      const topclubs = mockMultiple(() => mockStageClubResponse({ stage_id }), top);

      const topClubsPaged = { page: 1, per_page: top };
      mocks.getStageTopClubs(stage.season_id, stage_id).query(topClubsPaged)
        .reply(200, mockPagedResponse(topclubs, topClubsPaged));

      it("not participating", async () => {
        expect.assertions(1);

        const topClubsPagedOverride = { page: 1, per_page: top };
        mocks.getStageTopClubs(stage.season_id, stage_id).query(topClubsPagedOverride)
          .reply(200, mockPagedResponse(topclubs, topClubsPagedOverride));
        mocks.getStageClubMe(stage.season_id, stage_id).reply(200, { ...club, rank: 0 });

        const toGetTopNReq = stage.toGetTopN(top, { group_size, isARAM });

        expect(await toGetTopNReq).toMatchObject({ games_count: expect.any(Number), points_needed: expect.any(Number) });
      });

      it("higher place", async () => {
        expect.assertions(1);

        const new_top = 3;
        const topClubsPagedOverride = { page: 1, per_page: new_top };
        mocks.getStageTopClubs(stage.season_id, stage_id).query(topClubsPagedOverride)
          .reply(200, mockPagedResponse(topclubs, topClubsPagedOverride));
        mocks.getStageClubMe(stage.season_id, stage_id).reply(200, { ...club, rank: 1 });

        const toGetTopNReq = stage.toGetTopN(new_top, { group_size, isARAM });

        expect(await toGetTopNReq).toMatchObject({ games_count: expect.any(Number), points_needed: expect.any(Number) });
      });

      it("lower place", async () => {
        expect.assertions(1);

        const new_rank = chance.natural({ min: top, max: 25 });
        const topClubsPagedOverride = { page: 1, per_page: top };
        mocks.getStageTopClubs(stage.season_id, stage_id).query(topClubsPagedOverride)
          .reply(200, mockPagedResponse(topclubs, topClubsPagedOverride));
        mocks.getStageClubMe(stage.season_id, stage_id).reply(200, { ...club, rank: new_rank });

        const toGetTopNReq = stage.toGetTopN(top, { group_size, isARAM });

        expect(await toGetTopNReq).toMatchObject({ games_count: expect.any(Number), points_needed: expect.any(Number) });
      });
    });
  });
});