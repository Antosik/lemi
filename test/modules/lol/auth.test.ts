import * as dotenv from "dotenv";
import * as nock from "nock";

import ClubsAPI from "../../../src/lol";

dotenv.config();

describe("Clubs API: auth tests", () => {
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

      const club_id = 1;
      const season_id = 1;
      const stage_id = 1;

      api.getClubStage(club_id, season_id, stage_id)
        .catch((e) => {
          expect(e).toBeInstanceOf(Error);
        });

      done();
    });
  });

  describe("correct auth", () => {
    const api = new ClubsAPI(process.env.LOL_TOKEN);

    test("try to get clubs stages", async (done) => {
      const club_id = 1;
      const season_id = 1;
      const stage_id = 1;

      nock("https://clubs.lcu.ru.leagueoflegends.com/api/contest")
        .persist()
        .get(`/season/${season_id}/clubs/${club_id}/stages/`)
        .reply(200, require("../../responses/club-stages.json"));

      const stage = await api.getClubStage(club_id, season_id, stage_id);

      expect.assertions(1);
      expect(stage).toBeDefined();
      done();
    });
  });
});
