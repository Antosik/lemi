import * as nock from "nock";

import { ClubsAPIInvoker } from "../../../src/clubs-api/helpers/api-invoker";
import { createClubsAPIAxiosInstance } from "../../../src/clubs-api/helpers/axios";

describe("clubsAPI - Helpers", () => {
  describe("axiosInstance", () => {
    it("v1 endpoint", () => {
      expect.assertions(2);

      const instance = createClubsAPIAxiosInstance("https://clubs.lcu.ru.leagueoflegends.com/api/");

      expect(instance.defaults.baseURL).toStrictEqual("https://clubs.lcu.ru.leagueoflegends.com/api/");
      expect(instance.defaults.headers).toMatchObject({ "Cache-Control": "no-cache" });
    });

    it("v2 endpoint", () => {
      expect.assertions(2);

      const instance = createClubsAPIAxiosInstance("https://clubs.lcu.ru.leagueoflegends.com/api-v2/");

      expect(instance.defaults.baseURL).toStrictEqual("https://clubs.lcu.ru.leagueoflegends.com/api-v2/");
      expect(instance.defaults.headers).toMatchObject({ "Cache-Control": "no-cache" });
    });
  });

  describe("clubsAPIInvoker", () => {
    const invoker = new ClubsAPIInvoker();

    it("base v1 request", async () => {
      expect.assertions(1);

      const req = nock("https://clubs.lcu.ru.leagueoflegends.com/api/")
        .persist()
        .get("/rules/rulesversion/")
        .reply(200);

      await invoker.query("rules/rulesversion");

      expect(req.isDone()).toStrictEqual(true);
    });

    it("base v2 request", async () => {
      expect.assertions(1);

      const req = nock("https://clubs.lcu.ru.leagueoflegends.com/api-v2/")
        .persist()
        .get("/contest/season/")
        .reply(200);

      await invoker.query("contest/season", {}, 2);

      expect(req.isDone()).toStrictEqual(true);
    });
  });
});