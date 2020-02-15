import * as nock from "nock";

import { ClubsAPIInvoker } from "../../../src/clubs-api/helpers/api-invoker";
import { createClubsAPIAxiosInstance } from "../../../src/clubs-api/helpers/axios";

describe("ClubsAPI - Helpers", () => {
  describe("AxiosInstance", () => {
    test("v1 endpoint", () => {
      const instance = createClubsAPIAxiosInstance("https://clubs.lcu.ru.leagueoflegends.com/api/");

      expect(instance.defaults.baseURL).toEqual("https://clubs.lcu.ru.leagueoflegends.com/api/");
      expect(instance.defaults.headers).toMatchObject({ "Cache-Control": "no-cache" });
    });

    test("v2 endpoint", () => {
      const instance = createClubsAPIAxiosInstance("https://clubs.lcu.ru.leagueoflegends.com/api-v2/");

      expect(instance.defaults.baseURL).toEqual("https://clubs.lcu.ru.leagueoflegends.com/api-v2/");
      expect(instance.defaults.headers).toMatchObject({ "Cache-Control": "no-cache" });
    });
  });

  describe("ClubsAPIInvoker", () => {
    const invoker = new ClubsAPIInvoker();

    test("base v1 request", async (done) => {
      const req = nock("https://clubs.lcu.ru.leagueoflegends.com/api/")
        .persist()
        .get(`/rules/rulesversion/`)
        .reply(200);

      await invoker.query("rules/rulesversion");

      expect(req.isDone()).toBeTruthy();

      done();
    })

    test("base v2 request", async (done) => {
      const req = nock("https://clubs.lcu.ru.leagueoflegends.com/api-v2/")
        .persist()
        .get("/contest/season/")
        .reply(200);

      await invoker.query("contest/season", {}, 2);

      expect(req.isDone()).toBeTruthy();

      done();
    });
  });
});