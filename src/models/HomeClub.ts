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
    const { results: stage_clubs }: { results: IStageClub[] } = await this.query(`contest/season/${this.season_id}/stages/${stage_id}/clubs`, { params: { per_page: count } });
    return stage_clubs;
  }

  public async getStageMembers(stage_id: number, count: number = 25): Promise<IStageSummoner[]> {
    const { results: stage_members }: { results: IStageSummoner[] } = await this.query(`contest/season/${this.season_id}/stages/${stage_id}/summoners`, { params: { per_page: count } });
    return stage_members;
  }

  public async calculateStage(stage_id: number, { top = 1, group_size = 5, mode = 0 } = { top: 1, group_size: 5 }): Promise<{ top: number, games_count: number, points_needed: number }> {
    if (top < 1 || top > 25) throw new Error("Неверная позиция в топе");
    if (group_size < 2 || group_size > 5) throw new Error("Количество игроков может быть от 2 до 5");
    const points_per_game = !mode ? group_size * group_size * 10 : 5 * (group_size - 1) * group_size;

    const stage_clubs = await this.getStageClubs(stage_id);
    if (stage_clubs.length) {
      const { rank: current_place, points: current_points } = stage_clubs.find(stage_club => stage_club.club.id === this.id);

      if (current_place <= top) return { top, games_count: 0, points_needed: 0 };
      const { points } = stage_clubs.find(club => club.rank === top);
      const points_needed = points - current_points;
      const games_count = Math.ceil(points_needed / points_per_game);
      return { top, games_count, points_needed };
    }

    const { results: stages }: { results: IStageClub[] } = await this.query(`contest/season/${this.season_id}/clubs/${this.id}/stages`);
    const { points: current_points } = stages.find(stage => stage.stage === stage_id);
    const points_needed = 1000 - current_points;
    const games_count = Math.ceil(points_needed / points_per_game);

    return { top: 0, games_count, points_needed };
  }

  private async query(query, { data = {}, params = {} } = { data: {}, params: {} }): Promise<any> {
    if (!this.token) throw new Error("Ошибка авторизации");

    return axios.get(`${HomeClub.endpoint}/${query}/`, { params, data, headers: { Cookie: `PVPNET_TOKEN_RU=${this.token}` } }).then(({ data: result }) => result);
  }
}