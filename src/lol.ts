import { ICurrentSeason, ISeason } from "./interfaces/ISeason";

import LiveSeason from "./models/LiveSeason";
import Season from "./models/Season";

import apiCall from "./helpers/clubs-api";
import { consts } from "./localization";

export default class ClubsAPI {
  public static readonly endpoint = "https://clubs.ru.leagueoflegends.com/api";

  public async getSeasons(): Promise<Season[]> {
    const { results: seasons }: { results: ISeason[] } = await this.query("contest/season");
    return seasons.map((season) => new Season(season));
  }

  public async getLiveSeason(): Promise<LiveSeason | undefined> {
    const season: ICurrentSeason = await this.query("contest/season/current");
    return !season.id ? undefined : new LiveSeason(season);
  }

  private async query(query: string, { data = {}, params = {}, headers = {} } = { data: {}, params: {}, headers: {} }): Promise<any> {
    return apiCall(`/${query}/`, { params, data, headers })
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
}
