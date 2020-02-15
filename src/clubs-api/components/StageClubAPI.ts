import { ClubsAPIInvoker } from "../helpers/api-invoker";

import { IStageClubResponse } from "../interfaces/IClub";
import { IStageSummonerResponse, ISummonerStageRatingResponse } from "../interfaces/ISummoner";
import { IApiCaller, IPagedRequest, IPagedResponse } from "../interfaces/IApiCaller";

export class StageClubAPI implements IApiCaller {
  public readonly api: ClubsAPIInvoker;
  private stage_id: number;
  private season_id: number;

  constructor(stage_id: number, season_id: number, api: ClubsAPIInvoker) {
    this.api = api;
    this.stage_id = stage_id;
    this.season_id = season_id;
  }

  public async getStageTopClubs(params: IPagedRequest): Promise<IStageClubResponse[]> {
    const response = await this.stageQuery("clubs", { params });
    const { results } = response as IPagedResponse<IStageClubResponse>;
    return results;
  }

  public async getStageClub(identifier: number): Promise<IStageClubResponse | undefined> {
    const response = await this.api.query(`contest/season/${this.season_id}/clubs/${identifier}/stages`);
    const { results: club_stages } = { results: [] } = response as IPagedResponse<IStageClubResponse>;
    return club_stages.find(club_stage => club_stage.stage === this.stage_id);
  }

  public async getStageClubMe(): Promise<IStageClubResponse> {
    const response = await this.stageQuery("clubs/me");
    return response as IStageClubResponse;
  }

  public async getStageClubMembers(params: IPagedRequest): Promise<IStageSummonerResponse[]> {
    const response = await this.stageQuery("summoners", { params });
    const { results } = response as IPagedResponse<IStageSummonerResponse>;
    return results;
  }

  public async getStageClubMembersRating(): Promise<ISummonerStageRatingResponse[]> {
    const response = await this.api.query(`contest/season/${this.stage_id}/userstagerating`, {}, 2);
    return response as ISummonerStageRatingResponse[];
  }

  private async stageQuery(query: string, { params = {} } = { params: {} }, version = 1): Promise<unknown> {
    return this.api.query(`contest/season/${this.season_id}/stages/${this.stage_id}/${query}`, { params }, version);
  }
}