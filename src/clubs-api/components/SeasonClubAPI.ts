import { ClubsAPIInvoker } from "../helpers/api-invoker";

import { IApiCaller, IPagedRequest, IPagedResponse, TSeasonClubIdentifier } from "../interfaces/IApiCaller";
import { ISeasonsClubResponse } from "../interfaces/IClub";
import { IStageResponse } from "../interfaces/IStage";
import { ISummonerSeasonRatingResponse } from "../interfaces/ISummoner";
import { ISeasonRewardResponse, IStageRewardResponse } from "../interfaces/IReward";

export class SeasonClubAPI implements IApiCaller {
  public readonly api: ClubsAPIInvoker;
  private season_id: number;

  constructor(season_id: number, api: ClubsAPIInvoker) {
    this.season_id = season_id;
    this.api = api;
  }

  public async getSeasonTopClubs(params: IPagedRequest): Promise<ISeasonsClubResponse[]> {
    const response = await this.seasonQuery("clubs", { params });
    const { results } = response as IPagedResponse<ISeasonsClubResponse>;
    return results;
  }

  public async getSeasonClub(identifier: TSeasonClubIdentifier = "current"): Promise<ISeasonsClubResponse> {
    const response = await this.seasonQuery(`clubs/${identifier}`);
    return response as ISeasonsClubResponse;
  }

  public async getSeasonStages(): Promise<IStageResponse[]> {
    const response = await this.seasonQuery("stages");
    return response as IStageResponse[];
  }

  public async getSeasonStageById(id: number): Promise<IStageResponse> {
    const response = await this.seasonQuery(`stages/${id}`);
    return response as IStageResponse;
  }

  public async getSeasonClubRewards(): Promise<ISeasonRewardResponse[]> {
    const response = await this.seasonQuery("clubseasonrewards");
    return response as ISeasonRewardResponse[];
  }

  public async getSeasonStagesClubRewards(): Promise<IStageRewardResponse[]> {
    const response = await this.seasonQuery("clubstagerewards");
    return response as IStageRewardResponse[];
  }

  public async getSeasonClubMembersRating(): Promise<ISummonerSeasonRatingResponse[]> {
    const response = await this.api.query(`contest/season/${this.season_id}/userseasonrating`, {}, 2);
    return response as ISummonerSeasonRatingResponse[];
  }

  public async seasonQuery(query: string, { params = {} } = { params: {} }, version = 1): Promise<unknown> {
    return this.api.query(`contest/season/${this.season_id}/${query}`, { params }, version);
  }
}