import { ISeasonsClub, IStageClub } from "./interfaces/IClub";
import { ICurrentSeason, ISeason } from "./interfaces/ISeason";

import HomeClub from "./models/HomeClub";
import LiveSeason from "./models/LiveSeason";
import Season from "./models/Season";

import { ClubsAPICaller } from "./helpers/clubs-api";
import { consts } from "./localization";

export default class ClubsAPI extends ClubsAPICaller {
  public async getSeasons(): Promise<Season[]> {
    const { results: seasons }: { results: ISeason[] } = await this.query("contest/season");
    return seasons.map((season) => new Season(season, this._token));
  }

  public async getLiveSeason(): Promise<LiveSeason | undefined> {
    const season: ICurrentSeason = await this.query("contest/season/current");
    return !season.id ? undefined : new LiveSeason(season, this._token);
  }

  public async getHomeClub(): Promise<HomeClub | undefined> {
    const Cookie = this.getAuthCookie();
    if (!Cookie) {
      throw new Error(consts.authError);
    }

    const season = await this.getLiveSeason();
    if (!season) {
      throw new Error(consts.noActiveSeason);
    }

    const club: ISeasonsClub = await this.query(`contest/season/${season.id}/clubs/current`);
    return club?.club?.id ? new HomeClub(club.club, season.id, this._token) : undefined;
  }

  public async getClubStage(club_id: number, season_id: number, stage_id: number): Promise<IStageClub | undefined> {
    const Cookie = this.getAuthCookie();
    if (!Cookie) {
      throw new Error(consts.authError);
    }

    const { results: stages }: { results: IStageClub[] } = await this.query(`contest/season/${season_id}/clubs/${club_id}/stages`);
    return stages.find((stage) => stage.stage === stage_id);
  }
}
