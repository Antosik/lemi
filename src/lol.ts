import axios from "axios";
import { IStage } from "./interfaces/IStage";
import { IStageClub, ISeasonsClub, IParticipatingClub } from "./interfaces/IClub";
import { ISeason } from "./interfaces/ISeason";

export default class ClubsAPI {
  public static readonly endpoint = "https://clubs.ru.leagueoflegends.com/api";

  private token = "";

  constructor(token = "") {
    this.token = token;
  }

  private async query(query, { data = {}, params = {}, headers = {} } = { data: {}, params: {}, headers: {} }): Promise<any> {
    return axios.get(`${ClubsAPI.endpoint}/${query}/`, { params, data, headers }).then(({ data: result }) => result);
  }

  private getAuthCookie() {
    return this.token ? `PVPNET_TOKEN_RU=${this.token}` : "";
  }

  public async getSeasons(): Promise<ISeason[]> {
    const { results: seasons }: { results: ISeason[] } = await this.query("contest/season");
    return seasons;
  };

  public async getLiveSeason(): Promise<ISeason | undefined> {
    const seasons = await this.getSeasons();
    const live_seasons = seasons.filter(season => season.is_open && !season.is_closed);
    return !live_seasons.length ? undefined : live_seasons[0];
  };

  public async getStages(season: ISeason): Promise<IStage[]> {
    const { id: season_id } = season;
    const stages: IStage[] = await this.query(`contest/season/${season_id}/stages`);
    return stages;
  };

  public async getLiveStage(live_season: ISeason): Promise<IStage | undefined> {
    const stages = await this.getStages(live_season);
    const live_stages = stages.filter(stage => stage.is_open && !stage.is_closed);
    return !live_stages.length ? undefined : live_stages[0];
  };

  public async getTopNSeason(live_season: ISeason, count: number = 10): Promise<ISeasonsClub[]> {
    const { id: season_id } = live_season;
    const { results: seasons_clubs }: { results: ISeasonsClub[] } = await this.query(`contest/season/${season_id}/clubs`, { params: { per_page: count } });
    return seasons_clubs;
  };

  public async getHomeClub(season: ISeason): Promise<ISeasonsClub> {
    const Cookie = this.getAuthCookie();
    if (!Cookie) throw new Error("No token passed!");

    const { id: season_id } = season;
    return this.query(`contest/season/${season_id}/clubs/current`, { headers: { Cookie } });
  };

  public async getHomeClubStage(stage: IStage): Promise<IStageClub[]> {
    const Cookie = this.getAuthCookie();
    if (!Cookie) throw new Error("No token passed!");

    const { season: season_id, id: stage_id } = stage;
    const { results: stageClubs }: { results: IStageClub[] } = await this.query(`contest/season/${season_id}/stages/${stage_id}/clubs`, { headers: { Cookie } });
    return stageClubs;
  }
}