import { parse } from "date-fns";

import { StageClubAPI } from "../clubs-api/components/StageClubAPI";
import { IStageClubResponse } from "../clubs-api/interfaces/IClub";
import { IStageResponse, EStageModeResponse } from "../clubs-api/interfaces/IStage";
import { IStageSummonerResponse, ISummonerStageRatingResponse } from "../clubs-api/interfaces/ISummoner";
import { ClubsAPIInvoker } from "../clubs-api/helpers/api-invoker";

import { IStageEntity } from "../interfaces/IStage";
import { consts } from "../localization";
import { pointsCalculator, IPointsCalculatorParams } from "../helpers/calculator";

export default class Stage implements IStageEntity {
  private readonly stageAPI: StageClubAPI;

  public readonly stage_id: number;
  public readonly season_id: number;
  public readonly index: number;
  public readonly start_date: Date;
  public readonly end_date: Date;
  public readonly is_open: boolean;
  public readonly is_closed: boolean;
  public readonly mode: EStageModeResponse;

  constructor(data: IStageResponse, api: ClubsAPIInvoker) {
    this.stageAPI = new StageClubAPI(data.id, data.season, api);

    this.stage_id = data.id;
    this.season_id = data.season;
    this.index = data.number;
    this.start_date = parse(data.start_date, "yyyy-MM-dd", new Date(data.start_date));
    this.end_date = parse(data.end_date, "yyyy-MM-dd", new Date(data.end_date));
    this.is_open = data.is_open;
    this.is_closed = data.is_closed;
    this.mode = data.mode;
  }

  public isLive(): boolean {
    return this.is_open && !this.is_closed;
  }

  public async getClub(identifier: number): Promise<IStageClubResponse | undefined> {
    return this.stageAPI.getStageClub(identifier);
  }

  public async getClubMe(): Promise<IStageClubResponse> {
    const club = this.stageAPI.getStageClubMe();
    if (club === undefined) {
      throw new Error(consts.clubNotSelected);
    }
    return club;
  }

  public async getClubMembers(count: number = 25, page = 1): Promise<IStageSummonerResponse[]> {
    return this.stageAPI.getStageClubMembers({ page, per_page: count });
  }

  public async getClubMembersRating(): Promise<ISummonerStageRatingResponse[]> {
    return this.stageAPI.getStageClubMembersRating();
  }

  public async getTopN(count: number = 10, page: number = 1): Promise<IStageClubResponse[]> {
    return this.stageAPI.getStageTopClubs({ page, per_page: count });
  }

  public async toGetTopN(top = 1, params: IPointsCalculatorParams): Promise<{ top: number, games_count: number, points_needed: number }> {
    const { group_size } = { group_size: 5, ...params };

    if (top < 1 || top > 25) {
      throw new Error(consts.invalidTopPosition);
    }
    if (group_size < 2 || group_size > 5) {
      throw new Error(consts.invalidPlayerCount);
    }

    const [my_stage_club, other_stage_clubs] = await Promise.all([
      this.stageAPI.getStageClubMe(),
      this.getTopN(top)
    ]);

    const { rank, points } = my_stage_club;

    if (rank === undefined || rank === 0) {
      const results = this._toGetTopNNotParticipation(points, params);
      return { top: 0, ...results };
    } else {
      const results = this._toGetTopNParticipating(top, my_stage_club, other_stage_clubs, params);
      return { top, ...results };
    }
  }

  private _toGetTopNParticipating(top = 1, myclub: IStageClubResponse, clubs: IStageClubResponse[], params: IPointsCalculatorParams): { games_count: number, points_needed: number } {
    const { rank: current_place, points: current_points } = myclub;

    if (current_place <= top) {
      return { games_count: 0, points_needed: 0 };
    }

    const club_on_place = clubs[top - 1];
    if (club_on_place === undefined) {
      throw new Error(consts.errorGettingTopPosition);
    }

    const { points } = club_on_place;
    return pointsCalculator(current_points, points, params);
  }

  private _toGetTopNNotParticipation(current_points = 0, params: IPointsCalculatorParams): { games_count: number, points_needed: number } {
    return pointsCalculator(current_points, 1000, params);
  }
}
