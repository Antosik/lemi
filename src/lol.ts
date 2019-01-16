import axios from "axios";
import co from "co";

import { IStage } from "./interfaces/IStage";
import { IStageClub, ISeasonsClub, IParticipatingClub } from "./interfaces/IClub";
import { ISeason, ICurrentSeason } from "./interfaces/ISeason";
import { IStageSummoner } from "./interfaces/ISummoner";

import Season, { LiveSeason } from "./models/Season";
import Stage from "./models/Stage";
import HomeClub from "./models/HomeClub";

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

  public async getSeasons(): Promise<Season[]> {
    const { results: seasons }: { results: ISeason[] } = await this.query("contest/season");
    return seasons.map(season => new Season(season));
  };

  public async getLiveSeason(): Promise<LiveSeason | undefined> {
    const season: ICurrentSeason = await this.query("contest/season/current");
    return !season.id ? undefined : new LiveSeason(season);
  };

  public async getHomeClub(): Promise<HomeClub> {
    const Cookie = this.getAuthCookie();
    if (!Cookie) throw new Error("Ошибка авторизации!");

    const season = await this.getLiveSeason();
    if (!season) throw new Error("Нет активных сезонов!");

    const club: ISeasonsClub = await this.query(`contest/season/${season.id}/clubs/current`, { headers: { Cookie } });
    return !club.id ? undefined : new HomeClub(club.club, season.id, this.token);
  };
}