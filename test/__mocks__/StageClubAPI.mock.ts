import * as nock from "nock";

const getStageCoreNock = (season_id: number, stage_id: number, headers: object = {}) =>
  nock(`https://clubs.lcu.ru.leagueoflegends.com/api/contest/season/${season_id}/stages/${stage_id}/`, { reqheaders: { ...headers } }).persist();

export const mocks = {
  getStageTopClubs: (season_id: number, stage_id: number, headers: object = {}) =>
    getStageCoreNock(season_id, stage_id, headers).persist().persist().get("/clubs/"),

  getStageClub: (season_id: number, club_id: number, headers: object = {}) =>
    nock(`https://clubs.lcu.ru.leagueoflegends.com/api/contest/season/${season_id}`, { reqheaders: { ...headers } }).persist().get(`/clubs/${club_id}/stages/`),

  getStageClubMe: (season_id: number, stage_id: number, headers: object = {}) =>
    getStageCoreNock(season_id, stage_id, headers).persist().persist().get("/clubs/me/"),

  getStageClubMembers: (season_id: number, stage_id: number, headers: object = {}) =>
    getStageCoreNock(season_id, stage_id, headers).persist().persist().get("/summoners/"),

  getStageClubMembersRating: (stage_id: number, headers: object = {}) =>
    nock(`https://clubs.lcu.ru.leagueoflegends.com/api-v2/contest/season`, { reqheaders: { ...headers } }).persist().get(`/${stage_id}/userstagerating/`),
}