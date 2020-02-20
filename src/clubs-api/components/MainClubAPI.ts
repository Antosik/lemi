import { ClubsAPIInvoker } from "../helpers/api-invoker";

import { ISeasonResponse, ICurrentSeasonResponse } from "../interfaces/ISeason";
import { IInviteResponse } from "../interfaces/IInvite";
import { IApiCaller, IPagedRequest, ISortedRequest, IPagedResponse } from "../interfaces/IApiCaller";

export class MainClubAPI implements IApiCaller {
  public readonly api: ClubsAPIInvoker;

  constructor(api: ClubsAPIInvoker) {
    this.api = api;
  }

  public async getSeasons(): Promise<ISeasonResponse[]> {
    const response = await this.api.query("contest/season", {}, 2);
    return response as ISeasonResponse[];
  }

  public async getSeason(identifier: number): Promise<ISeasonResponse> {
    const response = await this.api.query(`contest/season/${identifier}`, {}, 2);
    return response as ICurrentSeasonResponse;
  }

  public async getLiveSeason(): Promise<ICurrentSeasonResponse | undefined> {
    const seasons = await this.getSeasons();
    const live_season = seasons.find(season => season.is_open && !season.is_closed);
    if (live_season === undefined) {
      return live_season;
    }

    const live_stage = live_season.stages.find(stage => stage.is_open && !stage.is_closed);
    return {
      ...live_season,
      current_stage: live_stage
    };
  }

  public async getIncomingRequests(club_id: number, params: ISortedRequest & IPagedRequest): Promise<IInviteResponse[]> {
    const response = await this.api.query("invites/requests", { params: { ...params, club: club_id } }, 2);
    const { results } = response as IPagedResponse<IInviteResponse>;
    return results;
  }
}
