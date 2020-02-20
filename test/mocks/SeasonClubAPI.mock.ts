import * as nock from "nock";

const getSeasonCoreNock = (season_id: number, headers: object = {}): nock.Scope =>
  nock(`https://clubs.lcu.ru.leagueoflegends.com/api/contest/season/${season_id}`, { reqheaders: { ...headers } });

export const mocks = {
  getSeasonTopClubs: (season_id: number, headers: object = {}): nock.Interceptor =>
    getSeasonCoreNock(season_id, headers).persist().get("/clubs/"),

  getSeasonClub: (season_id: number, club_id: number, headers: object = {}): nock.Interceptor =>
    getSeasonCoreNock(season_id, headers).persist().get(`/clubs/${club_id}/`),

  getSeasonClubCurrent: (season_id: number, headers: object = {}): nock.Interceptor =>
    getSeasonCoreNock(season_id, headers).persist().get("/clubs/current/"),

  getSeasonStages: (season_id: number, headers: object = {}): nock.Interceptor =>
    getSeasonCoreNock(season_id, headers).persist().get("/stages/"),

  getSeasonStageById: (season_id: number, stage_id: number, headers: object = {}): nock.Interceptor =>
    getSeasonCoreNock(season_id, headers).persist().get(`/stages/${stage_id}/`),

  getSeasonClubRewards: (season_id: number, headers: object = {}): nock.Interceptor =>
    getSeasonCoreNock(season_id, headers).persist().get("/clubseasonrewards/"),

  getSeasonStagesClubRewards: (season_id: number, headers: object = {}): nock.Interceptor =>
    getSeasonCoreNock(season_id, headers).persist().get("/clubstagerewards/"),

  getSeasonClubMembersRating: (season_id: number, headers: object = {}): nock.Interceptor =>
    nock(`https://clubs.lcu.ru.leagueoflegends.com/api-v2/contest/season/${season_id}`, { reqheaders: { ...headers } }).persist().get("/userseasonrating/"),
};