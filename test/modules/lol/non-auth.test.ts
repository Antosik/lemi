import * as dotenv from "dotenv";
import * as nock from "nock";

import ClubsAPI from "../../../src/lol";

dotenv.config();

describe("Clubs API tests: non-needed auth tests", () => {
  const api = new ClubsAPI(process.env.LOL_TOKEN);

  test("get seasons list", async (done) => {
    nock("https://clubs.lcu.ru.leagueoflegends.com/api/contest")
      .persist()
      .get(`/season/`)
      .reply(200, require("../../responses/seasons-list.json"));

    const seasons = await api.getSeasons();

    expect.assertions(2);
    expect(seasons).toBeDefined();
    expect(Array.isArray(seasons)).toBeTruthy();
    done();
  });

  describe("get season info", () => {
    beforeEach(() => {
      nock("https://clubs.lcu.ru.leagueoflegends.com/api/contest")
        .persist()
        .get(`/season/`)
        .reply(200, require("../../responses/seasons-list.json"));
    });

    test("get top 5 of season", async (done) => {
      const seasons = await api.getSeasons();
      const season = seasons[seasons.length - 1];

      nock("https://clubs.lcu.ru.leagueoflegends.com/api/contest")
        .persist()
        .get(`/season/${season.id}/clubs/`)
        .query({ per_page: 3, page: 1 })
        .reply(200, require("../../responses/seasons-clubs.json"));
      const top = await season.getTopN(3);

      expect.assertions(3);
      expect(top).toBeDefined();
      expect(Array.isArray(top)).toBeTruthy();
      expect(top.length).toEqual(3);
      done();
    });

    test("get stages of season", async (done) => {
      const seasons = await api.getSeasons();
      const season = seasons[seasons.length - 1];

      nock("https://clubs.lcu.ru.leagueoflegends.com/api/contest")
        .persist()
        .get(`/season/${season.id}/stages/`)
        .reply(200, require("../../responses/seasons-stages.json"));
      const stages = await season.getStages();

      expect.assertions(2);
      expect(stages).toBeDefined();
      expect(Array.isArray(stages)).toBeTruthy();
      done();
    });
  });

  test("get live season", async (done) => {
    nock("https://clubs.lcu.ru.leagueoflegends.com/api/contest")
      .persist()
      .get(`/season/current/`)
      .reply(200, require("../../responses/live-season.json"));

    const season = await api.getLiveSeason();

    expect.assertions(2);
    expect(season).toBeDefined();
    expect(typeof season).toBe("object");
    done();
  });
});
