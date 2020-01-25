import * as dotenv from "dotenv";
import * as nock from "nock";

import ClubsAPI from "../../../src/lol";

dotenv.config();

describe("Clubs API: homeclub tests", () => {
  const api = new ClubsAPI(process.env.LOL_TOKEN);
  const Cookie = `PVPNET_TOKEN_RU=${process.env.LOL_TOKEN}`;

  nock("https://clubs.lcu.ru.leagueoflegends.com/api/contest")
    .persist()
    .get(`/season/current/`)
    .reply(200, require("../../responses/live-season.json"));

  nock("https://clubs.lcu.ru.leagueoflegends.com/api/contest")
    .persist()
    .get(/\/season\/(\d+)\/clubs\/current\//, {}, { reqheaders: { Cookie } })
    .reply(200, require("../../responses/homeclub.json"));

  test("try to get homeclub", async (done) => {
    const club = await api.getHomeClub();

    expect.assertions(1);
    expect(club).toBeDefined();
    done();
  });
});
