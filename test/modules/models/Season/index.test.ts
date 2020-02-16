import { Chance } from "chance";

import { mocks } from "../../../mocks/SeasonClubAPI.mock";
import { mockPagedResponse } from "../../../mocks/responses/IApiCaller";
import { mockSeasonsClubResponse } from "../../../mocks/responses/IClub.mock";
import { mockSeasonResponse } from "../../../mocks/responses/ISeason.mock";
import { mockMultiple, getRandomElement } from "../../../mocks/responses/helpers";

import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

import Season from "../../../../src/models/Season";
import { consts } from "../../../../src/localization";

const chance = new Chance();

describe("clubs - Season Entity - without auth", () => {
  const paged = { page: 1, per_page: 10 };
  const api = new ClubsAPIInvoker();

  const season_data = mockSeasonResponse({ is_live: false });
  const season = new Season(season_data, api);

  it("isLive", () => {
    expect.assertions(1);

    expect(season.isLive()).toStrictEqual(season.is_open && !season.is_closed);
  });

  describe("getStageByIndex", () => {
    it("not existing", () => {
      expect.assertions(1);

      const randomId = chance.natural({ min: season.stages.length });

      expect(() => {
        season.getStageByIndex(randomId);
      }).toThrow(consts.stageNotFound);
    });

    it("existing", () => {
      expect.assertions(1);

      const randomId = chance.natural({ min: 0, max: season.stages.length - 1 });
      const stage = season.getStageByIndex(randomId);

      expect(stage).toBeDefined();
    });
  });

  describe("getStageById", () => {
    it("not existing", () => {
      expect.assertions(1);

      expect(() => {
        season.getStageById(chance.integer({ max: 0 }));
      }).toThrow(consts.stageNotFound);
    });

    it("existing", () => {
      expect.assertions(1);

      const stages_ids = season.stages.map(st => st.stage_id);
      const randomId = getRandomElement(stages_ids);
      const stage = season.getStageById(randomId);

      expect(stage).toBeDefined();
    });
  });

  it("getTopN", async () => {
    expect.assertions(2);

    const clubs = mockMultiple(() => mockSeasonsClubResponse({ season_id: season.season_id }));
    const req = mocks.getSeasonTopClubs(season.season_id).query(paged)
      .reply(200, mockPagedResponse(clubs, paged));

    const getTopNReq = season.getTopN(paged.per_page, paged.page);

    expect(await getTopNReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });


  it("getClub - byId", async () => {
    expect.assertions(2);

    const random_club = mockSeasonsClubResponse({ season_id: season.season_id });
    const req = mocks.getSeasonClub(season.season_id, random_club.club.id)
      .reply(200, random_club);

    const getClubReq = season.getClub(random_club.club.id);

    expect(await getClubReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });

  describe("findClub", () => {
    const clubs = mockMultiple(() => mockSeasonsClubResponse({ season_id: season.season_id }));

    it("not existing", async () => {
      expect.assertions(2);

      const req = mocks.getSeasonTopClubs(season.season_id).query({ ...paged, per_page: 50 })
        .reply(200, mockPagedResponse(clubs, paged));

      const findClubReq = season.findClub(chance.name());

      expect(await findClubReq).toHaveLength(0);
      expect(req.isDone()).toStrictEqual(true);
    });

    it("existing", async () => {
      expect.assertions(1);

      mocks.getSeasonTopClubs(season.season_id).query({ ...paged, per_page: 50 })
        .reply(200, mockPagedResponse(clubs, paged));

      const randomClub = getRandomElement(clubs);

      const findClubReq = season.findClub(randomClub.club.lol_name);

      expect(await findClubReq).toHaveLength(1);
    });
  });
});