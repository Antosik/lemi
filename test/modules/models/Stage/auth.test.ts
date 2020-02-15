import { Chance } from "chance";

import { mocks } from "../../../__mocks__/StageClubAPI.mock";
import { mockPagedResponse } from "../../../__mocks__/responses/IApiCaller";
import { mockStageClubResponse } from "../../../__mocks__/responses/IClub.mock";
import { mockStageResponse } from "../../../__mocks__/responses/IStage.mock";
import { mockStageSummonerResponse, mockSummonerStageRatingResponse } from "../../../__mocks__/responses/ISummoner.mock";
import { mockMultiple } from "../../../__mocks__/responses/helpers";

import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

import Stage from "../../../../src/models/Stage";
import { consts } from "../../../../src/localization";

const chance = new Chance();

describe("Clubs - Stage Entity [auth]", () => {
  const season_id = chance.natural({ max: 15 });
  const paged = { page: 1, per_page: 10 };
  const api = new ClubsAPIInvoker();

  const stage_data = mockStageResponse({ season_id, index: 0, is_live: false });
  const stage = new Stage(stage_data, api);

  const { stage_id } = stage;

  test("getClub", async () => {
    const current_stage = mockStageClubResponse({ stage_id });
    const other_stages = mockMultiple((_, i) => mockStageClubResponse({ stage_id: i }));
    const stages = [...other_stages, current_stage];

    const club_id = current_stage.club.id;
    const req = mocks.getStageClub(season_id, club_id)
      .reply(200, mockPagedResponse(stages));

    const getClubReq = stage.getClub(club_id);

    await expect(getClubReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  test("getClubMe", async () => {
    const club = mockStageClubResponse({ stage_id });
    const req = mocks.getStageClubMe(stage.season_id, stage_id).reply(200, club);

    const getClubMeReq = stage.getClubMe();

    await expect(getClubMeReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  test("getClubMembers", async () => {
    const members = mockMultiple(() => mockStageSummonerResponse({ stage_id }))
    const req = mocks.getStageClubMembers(stage.season_id, stage_id).query(paged)
      .reply(200, mockPagedResponse(members, paged));

    const getClubMembersReq = stage.getClubMembers(paged.per_page, paged.page);

    await expect(getClubMembersReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  test("getClubMembersRating", async () => {
    const rating = mockMultiple(() => mockSummonerStageRatingResponse({ stage_id }));
    const req = mocks.getStageClubMembersRating(stage_id).reply(200, rating);

    const getClubMembersRatingReq = stage.getClubMembersRating();

    await expect(getClubMembersRatingReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  test("getTopN", async () => {
    const clubs = mockMultiple(() => mockStageClubResponse({ stage_id }));
    const req = mocks.getStageTopClubs(stage.season_id, stage_id).query(paged)
      .reply(200, mockPagedResponse(clubs, paged));

    const getTopNReq = stage.getTopN(paged.per_page, paged.page);

    await expect(getTopNReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  describe("toGetTopN", () => {
    test("Invalid top", async () => {
      const top = chance.natural({ min: 26 });

      const toGetTopNReq = stage.toGetTopN(top, { group_size: 5, isARAM: true });

      await expect(toGetTopNReq).rejects.toThrow(consts.invalidTopPosition);
    });

    test("Invalid group size", async () => {
      const top = chance.natural({ min: 2, max: 20 });
      const group_size = chance.bool() ? chance.natural({ min: 5 }) : 1;

      const toGetTopNReq = stage.toGetTopN(top, { group_size, isARAM: true });

      await expect(toGetTopNReq).rejects.toThrow(consts.invalidPlayerCount);
    });

    describe("Valid arguments", () => {
      const top = chance.natural({ min: 2, max: 25 });
      const group_size = chance.natural({ min: 3, max: 5 });
      const isARAM = chance.bool();

      const club = mockStageClubResponse({ stage_id });
      const topclubs = mockMultiple(() => mockStageClubResponse({ stage_id }), top);

      const topClubsPaged = { page: 1, per_page: top };
      mocks.getStageTopClubs(stage.season_id, stage_id).query(topClubsPaged)
        .reply(200, mockPagedResponse(topclubs, topClubsPaged));

      test("Not participating", async () => {
        const topClubsPaged = { page: 1, per_page: top };
        mocks.getStageTopClubs(stage.season_id, stage_id).query(topClubsPaged)
          .reply(200, mockPagedResponse(topclubs, topClubsPaged));
        mocks.getStageClubMe(stage.season_id, stage_id).reply(200, { ...club, rank: 0 });

        const toGetTopNReq = stage.toGetTopN(top, { group_size, isARAM });

        await expect(toGetTopNReq).resolves.toMatchObject({ games_count: expect.any(Number), points_needed: expect.any(Number) });
      });

      test("Higher place", async () => {
        const new_top = 3;
        const topClubsPaged = { page: 1, per_page: new_top };
        mocks.getStageTopClubs(stage.season_id, stage_id).query(topClubsPaged)
          .reply(200, mockPagedResponse(topclubs, topClubsPaged));
        mocks.getStageClubMe(stage.season_id, stage_id).reply(200, { ...club, rank: 1 });

        const toGetTopNReq = stage.toGetTopN(new_top, { group_size, isARAM });

        await expect(toGetTopNReq).resolves.toMatchObject({ games_count: expect.any(Number), points_needed: expect.any(Number) });
      });

      test("Lower place", async () => {
        const new_rank = chance.natural({ min: top, max: 25 });
        const topClubsPaged = { page: 1, per_page: top };
        mocks.getStageTopClubs(stage.season_id, stage_id).query(topClubsPaged)
          .reply(200, mockPagedResponse(topclubs, topClubsPaged));
        mocks.getStageClubMe(stage.season_id, stage_id).reply(200, { ...club, rank: new_rank });

        const toGetTopNReq = stage.toGetTopN(top, { group_size, isARAM });

        await expect(toGetTopNReq).resolves.toMatchObject({ games_count: expect.any(Number), points_needed: expect.any(Number) });
      });
    });
  });
});