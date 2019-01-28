import * as dotenv from "dotenv";

import ClubsAPI from "../../src/lol";

dotenv.config();

describe("Clubs tests", () => {
  test("init tests", () => {
    const api = new ClubsAPI();

    expect.assertions(2);
    expect(api).toBeDefined();
    expect(api).toBeInstanceOf(ClubsAPI);
  });

  describe("non-needed auth tests", () => {
    const api = new ClubsAPI(process.env.LOL_TOKEN);

    describe("get season info", async () => {
      test("get top of season", async (done) => {
        const seasons = await api.getSeasons();
        const season = seasons[seasons.length - 1];
        const top = await season.getTopN();

        expect.assertions(3);
        expect(top).toBeDefined();
        expect(Array.isArray(top)).toBeTruthy();
        expect(top.length).toEqual(10);
        done();
      });

      test("get top5 of season", async (done) => {
        const seasons = await api.getSeasons();
        const season = seasons[seasons.length - 1];
        const top = await season.getTopN(5);

        expect.assertions(3);
        expect(top).toBeDefined();
        expect(Array.isArray(top)).toBeTruthy();
        expect(top.length).toEqual(5);
        done();
      });

      test("get stages of season", async (done) => {
        const seasons = await api.getSeasons();
        const season = seasons[seasons.length - 1];
        const stages = await season.getStages();

        expect.assertions(2);
        expect(stages).toBeDefined();
        expect(Array.isArray(stages)).toBeTruthy();
        done();
      });
    });

    test("get live season", async (done) => {
      const season = await api.getLiveSeason();

      expect.assertions(2);
      expect(season).toBeDefined();
      expect(typeof season).toBe("object");
      done();
    });

    test("get seasons list", async (done) => {
      const seasons = await api.getSeasons();

      expect.assertions(2);
      expect(seasons).toBeDefined();
      expect(Array.isArray(seasons)).toBeTruthy();
      done();
    });
  });

  describe("auth tests", () => {
    describe("incorrect auth", () => {
      const api = new ClubsAPI();

      test("try to get homeclub", (done) => {
        expect.assertions(1);

        api.getHomeClub()
          .catch((e) => {
            expect(e).toBeInstanceOf(Error);
          });

        done();
      });

      test("try to get clubs stages", (done) => {
        expect.assertions(1);

        const club_id = 49563;
        const season_id = 16;
        const stage_id = 48;

        api.getClubStage(club_id, season_id, stage_id)
          .catch((e) => {
            expect(e).toBeInstanceOf(Error);
          });

        done();
      });
    });

    describe("correct auth", () => {
      const api = new ClubsAPI(process.env.LOL_TOKEN);

      test("try to get homeclub", async (done) => {
        const club = await api.getHomeClub();

        expect.assertions(1);
        expect(club).toBeDefined();
        done();
      });

      test("try to get clubs stages", async (done) => {
        const club_id = 49563;
        const season_id = 16;
        const stage_id = 48;

        const stage = await api.getClubStage(club_id, season_id, stage_id);

        expect.assertions(1);
        expect(stage).toBeDefined();
        done();
      });
    });
  });
});
