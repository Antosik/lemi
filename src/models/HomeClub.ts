import axios from "axios";
import { IClub, IStageClub, ISeasonsClub } from "../interfaces/IClub";
import { IStageSummoner } from "interfaces/ISummoner";

export default class HomeClub {
  public static readonly endpoint = "https://clubs.ru.leagueoflegends.com/api";

  private readonly token: string;
  private readonly season_id: number;

  public readonly id: number;
  public readonly name: string;

  public readonly owner_id: number;
  public readonly owner_name: string;
  public readonly owner_avatar: string;

  public readonly seasons_count: number;
  public readonly members_count: number;

  constructor(data: IClub, season_id: number, token: string = "") {
    this.token = token;
    this.season_id = season_id;

    this.id = data.id;
    this.name = data.lol_name.trim();

    this.owner_id = data.owner.lol_account_id;
    this.owner_name = data.owner.summoner_name.trim();
    this.owner_avatar = data.owner.avatar

    this.seasons_count = data.seasons_count;
    this.members_count = data.members_count;
  }

  public async getSeason(): Promise<ISeasonsClub> {
    return this.query(`contest/season/${this.season_id}/clubs/current`);
  }

  public async getStageClubs(stage_id: number, count: number = 25): Promise<IStageClub[]> {
    const { results: stageClubs }: { results: IStageClub[] } = await this.query(`contest/season/${this.season_id}/stages/${stage_id}/clubs`, { params: { per_page: count } });
    return stageClubs;
  }

  public async getStageMembers(stage_id: number, count: number = 25): Promise<IStageSummoner[]> {
    const { results: stageMembers }: { results: IStageSummoner[] } = await this.query(`contest/season/${this.season_id}/stages/${stage_id}/summoners`, { params: { per_page: count } });
    return stageMembers;
  }

  private async query(query, { data = {}, params = {} } = { data: {}, params: {} }): Promise<any> {
    if (!this.token) throw new Error("No token provided");

    return axios.get(`${HomeClub.endpoint}/${query}/`, { params, data, headers: { Cookie: `PVPNET_TOKEN_RU=${this.token}` } }).then(({ data: result }) => result);
  }
}