import * as nock from "nock";

const getMainCoreNock = (headers: object = {}): nock.Scope =>
  nock("https://clubs.lcu.ru.leagueoflegends.com/api-v2/", { reqheaders: { ...headers } });

export const mocks = {
  getSeasons: (headers: object = {}): nock.Interceptor =>
    getMainCoreNock(headers).get("/contest/season/"),

  getSeason: (season_id: number, headers: object = {}): nock.Interceptor =>
    getMainCoreNock(headers).get(`/contest/season/${season_id}/`),

  getIncomingRequests: (headers: object = {}): nock.Interceptor =>
    getMainCoreNock(headers).get("/invites/requests/"),
};