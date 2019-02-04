import axios from "axios";

import { ISeasonsClub, IStageClub } from "./interfaces/IClub";
import { ICurrentSeason, ISeason } from "./interfaces/ISeason";

import HomeClub from "./models/HomeClub";
import LiveSeason from "./models/LiveSeason";
import Season from "./models/Season";

import { consts } from "./localization";

export default class ClubsAPI {
  public static readonly endpoint = "https://clubs.ru.leagueoflegends.com/api";

  private token = "";

  constructor(token = "") {
    this.token = token;
  }

  public async getSeasons(): Promise<Season[]> {
    const { results: seasons }: { results: ISeason[] } = await this.query("contest/season");
    return seasons.map((season) => new Season(season));
  }

  public async getLiveSeason(): Promise<LiveSeason | undefined> {
    const season: ICurrentSeason = await this.query("contest/season/current");
    return !season.id ? undefined : new LiveSeason(season);
  }

  public async getHomeClub(): Promise<HomeClub> {
    const Cookie = this.getAuthCookie();
    if (!Cookie) {
      throw new Error(consts.authError);
    }

    const season = await this.getLiveSeason();
    if (!season) {
      throw new Error(consts.noActiveSeason);
    }

    const club: ISeasonsClub = await this.query(`contest/season/${season.id}/clubs/current`, { headers: { Cookie } });
    return !club && !club.club && !club.club.id ? undefined : new HomeClub(club.club, season.id, this.token);
  }

  public async getClubStage(club_id: number, season_id: number, stage_id: number): Promise<IStageClub> {
    const Cookie = this.getAuthCookie();
    if (!Cookie) {
      throw new Error(consts.authError);
    }

    const { results: stages }: { results: IStageClub[] } = await this.query(`contest/season/${season_id}/clubs/${club_id}/stages`, { headers: { Cookie } });
    return stages.find((stage) => stage.stage === stage_id);
  }

  private async query(query: string, { data = {}, params = {}, headers = {} } = { data: {}, params: {}, headers: {} }): Promise<any> {
    return axios.get(`${ClubsAPI.endpoint}/${query}/`, { params, data, headers })
      .then(({ data: result }) => result)
      .catch((e) => {
        if (e.response && e.response.data && e.response.data.detail && e.response.data.detail === "club not selected") {
          throw new Error(consts.clubNotSelected);
        }
        if (e.response.status === 401) {
          throw new Error(consts.authError);
        }
        throw new Error(consts.requestError);
      });
  }

  private getAuthCookie() {
    return this.token ? `PVPNET_TOKEN_RU=${this.token}` : "";
  }
}
