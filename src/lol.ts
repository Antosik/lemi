import axios from "axios";
import { IStage } from "./interfaces/IStage";
import { IStageClub, ISeasonsClub, IParticipatingClub } from "./interfaces/IClub";
import { ISeason, ICurrentSeason } from "./interfaces/ISeason";
import { IStageSummoner } from "interfaces/ISummoner";

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

  public async getLiveSeason(): Promise<ICurrentSeason | undefined> {
    const season: ICurrentSeason = await this.query("contest/season/current");
    return !season.id ? undefined : season;
  };

  public async getStages(season: ISeason): Promise<IStage[]> {
    const { id: season_id } = season;
    const stages: IStage[] = await this.query(`contest/season/${season_id}/stages`);
    return stages;
  };

  public async getLiveStage(): Promise<IStage | undefined> {
    const season: ICurrentSeason = await this.getLiveSeason();
    return !season.current_stage && !season.current_stage.id ? undefined : season.current_stage;
  };

  public async getTopNSeason(season: ISeason, count: number = 10): Promise<ISeasonsClub[]> {
    const { id: season_id } = season;
    const { results: seasons_clubs }: { results: ISeasonsClub[] } = await this.query(`contest/season/${season_id}/clubs`, { params: { per_page: count } });
    return seasons_clubs;
  };

  public async getHomeClub(season: ISeason): Promise<ISeasonsClub> {
    const Cookie = this.getAuthCookie();
    if (!Cookie) throw new Error("No token passed!");

    const { id: season_id } = season;
    return this.query(`contest/season/${season_id}/clubs/current`, { headers: { Cookie } });
  };

  public async getHomeClubStage(stage: IStage, count: number = 25): Promise<IStageClub[]> {
    const Cookie = this.getAuthCookie();
    if (!Cookie) throw new Error("No token passed!");

    const { season: season_id, id: stage_id } = stage;
    const { results: stageClubs }: { results: IStageClub[] } = await this.query(`contest/season/${season_id}/stages/${stage_id}/clubs`, { headers: { Cookie }, params: { per_page: count } });
    return stageClubs;
  }

  public async getHomeClubStageMembers(stage: IStage, count: number = 25): Promise<IStageSummoner[]> {
    const Cookie = this.getAuthCookie();
    if (!Cookie) throw new Error("No token passed!");

    const { season: season_id, id: stage_id } = stage;
    const { results: stageMembers }: { results: IStageSummoner[] } = await this.query(`contest/season/${season_id}/stages/${stage_id}/summoners`, { headers: { Cookie }, params: { per_page: count } });
    return stageMembers;
  }

  public async getHomeClubLiveStageMembers(count: number = 25): Promise<IStageSummoner[]> {
    const stage: IStage = await this.getLiveStage();
    return this.getHomeClubStageMembers(stage, count);
  }
}