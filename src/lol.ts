import { MainClubAPI } from "./clubs-api/components/MainClubAPI";
import { ClubsAPIInvoker } from "./clubs-api/helpers/api-invoker";

import LiveSeason from "./models/LiveSeason";
import Season from "./models/Season";



export default class ClubsAPI {
  private mainAPI: MainClubAPI;

  constructor(api: ClubsAPIInvoker) {
    this.mainAPI = new MainClubAPI(api);
  }

  public async getSeasons(): Promise<Season[]> {
    const seasons = await this.mainAPI.getSeasons();
    return seasons.map((season) => new Season(season, this.mainAPI.api));
  }

  public async getLiveSeason(): Promise<LiveSeason | undefined> {
    const season = await this.mainAPI.getLiveSeason();
    return !season?.id ? undefined : new LiveSeason(season, this.mainAPI.api);
  }
}
