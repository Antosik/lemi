import { Chance } from "chance";

import { mocks } from "../../../__mocks__/SeasonClubAPI.mock";
import { mockPagedResponse } from "../../../__mocks__/responses/IApiCaller";
import { mockSeasonsClubResponse } from "../../../__mocks__/responses/IClub.mock";
import { mockSeasonResponse } from "../../../__mocks__/responses/ISeason.mock";
import { mockMultiple, getRandomElement } from "../../../__mocks__/responses/helpers";

import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

import Season from "../../../../src/models/Season";
import { consts } from "../../../../src/localization";

const chance = new Chance();

describe("Clubs - Season Entity - without auth", () => {
  const paged = { page: 1, per_page: 10 };
  const api = new ClubsAPIInvoker();

  const season_data = mockSeasonResponse({ is_live: false });
  const season = new Season(season_data, api);

  test("isLive", () => {
    expect(season.isLive()).toStrictEqual(season.is_open && !season.is_closed);
  });

  describe("getStageByIndex", () => {
    test("not existing", () => {
      const randomId = chance.natural({ min: season.stages.length });

      expect(() => {
        season.getStageByIndex(randomId);
      }).toThrow(consts.stageNotFound);
    })

    test("existing", () => {
      const randomId = chance.natural({ min: 0, max: season.stages.length - 1 });
      const stage = season.getStageByIndex(randomId);

      expect(stage).toBeDefined();
    });
  });

  describe("getStageById", () => {
    test("not existing", () => {
      expect(() => {
        season.getStageById(chance.integer({ max: 0 }));
      }).toThrow(consts.stageNotFound);
    })

    test("existing", () => {
      const stages_ids = season.stages.map(stage => stage.stage_id);
      const randomId = getRandomElement(stages_ids);
      const stage = season.getStageById(randomId);

      expect(stage).toBeDefined();
    });
  });

  test("getTopN", async () => {
    const clubs = mockMultiple(() => mockSeasonsClubResponse({ season_id: season.season_id }));
    const req = mocks.getSeasonTopClubs(season.season_id).query(paged)
      .reply(200, mockPagedResponse(clubs, paged));

    const getTopNReq = season.getTopN(paged.per_page, paged.page);

    await expect(getTopNReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });


  test("getClub - byId", async () => {
    const random_club = mockSeasonsClubResponse({ season_id: season.season_id });
    const req = mocks.getSeasonClub(season.season_id, random_club.club.id)
      .reply(200, random_club);

    const getClubReq = season.getClub(random_club.club.id);

    await expect(getClubReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  });

  describe("findClub", () => {
    const clubs = mockMultiple(() => mockSeasonsClubResponse({ season_id: season.season_id }));

    test("not existing", async () => {
      const req = mocks.getSeasonTopClubs(season.season_id).query({ ...paged, per_page: 50 })
        .reply(200, mockPagedResponse(clubs, paged));

      const findClubReq = season.findClub(chance.name());

      await expect(findClubReq).resolves.toHaveLength(0);
      expect(req.isDone()).toBeTruthy();
    });

    test("existing", async () => {
      mocks.getSeasonTopClubs(season.season_id).query({ ...paged, per_page: 50 })
        .reply(200, mockPagedResponse(clubs, paged));

      const randomClub = getRandomElement(clubs);

      const findClubReq = season.findClub(randomClub.club.lol_name);

      await expect(findClubReq).resolves.toHaveLength(1);
    });
  });
});