import { parse } from "date-fns";

import { SeasonClubAPI } from "../clubs-api/components/SeasonClubAPI";
import { IPagedResponse, TSeasonClubIdentifier } from "../clubs-api/interfaces/IApiCaller";
import { ISeasonsClubResponse } from "../clubs-api/interfaces/IClub";
import { IRewardConditionResponse } from "../clubs-api/interfaces/IReward";
import { ISeasonResponse } from "../clubs-api/interfaces/ISeason";
import { ISummonerSeasonRatingResponse } from "../clubs-api/interfaces/ISummoner";
import { ClubsAPIInvoker } from "../clubs-api/helpers/api-invoker";

import Stage from "./Stage";

import { ISeasonRewardEntity, IStageRewardEntity, IRewardEntity } from "../interfaces/IReward";
import { ISeasonEntity } from "../interfaces/ISeason";
import { consts } from "../localization";
import { pointsCalculator, IPointsCalculatorParams } from "../helpers/calculator";

export default class Season implements ISeasonEntity {
  private readonly seasonAPI: SeasonClubAPI;

  public readonly season_id: number;
  public readonly title: string;
  public readonly start_date: Date;
  public readonly end_date: Date;
  public readonly is_open: boolean;
  public readonly is_closed: boolean;
  public readonly stages: Stage[];

  constructor(data: ISeasonResponse, api: ClubsAPIInvoker) {
    this.seasonAPI = new SeasonClubAPI(data.id, api);

    this.season_id = data.id;
    this.title = data.title.trim();
    this.start_date = parse(data.start_date, "yyyy-MM-dd", new Date(data.start_date));
    this.end_date = parse(data.end_date, "yyyy-MM-dd", new Date(data.end_date));
    this.is_open = data.is_open;
    this.is_closed = data.is_closed;
    this.stages = data.stages.map((stage) => new Stage(stage, api));
  }

  public isLive(): boolean {
    return this.is_open && !this.is_closed;
  }

  public getStageByIndex(index: number): Stage | undefined {
    const stage = this.stages.find(({ index: i }) => index === i);
    if (stage === undefined) {
      throw new Error(consts.stageNotFound);
    }
    return stage;
  }

  public getStageById(id: number): Stage | undefined {
    const stage = this.stages.find(({ stage_id }) => stage_id === id);
    if (stage === undefined) {
      throw new Error(consts.stageNotFound);
    }
    return stage;
  }

  public async getTopN(count: number = 10, page: number = 1): Promise<ISeasonsClubResponse[]> {
    return this.seasonAPI.getSeasonTopClubs({ page, per_page: count });
  }

  public async getClub(identifier: TSeasonClubIdentifier = "current"): Promise<ISeasonsClubResponse> {
    const club = await this.seasonAPI.getSeasonClub(identifier);
    if (identifier === "current" && club === undefined) {
      throw new Error(consts.clubNotSelected);
    }

    if (club.points !== 0) {
      return club;
    }

    const members_rating = await this.getClubMembersRating();
    const points_sum = members_rating.reduce<number>((acc, el) => acc + el.points, 0);
    return { ...club, points: points_sum };
  }

  public async getClubMembersRating(): Promise<ISummonerSeasonRatingResponse[]> {
    return this.seasonAPI.getSeasonClubMembersRating();
  }

  public async getClubSeasonRewards(): Promise<ISeasonRewardEntity> {
    const [reward_data] = await this.seasonAPI.getSeasonClubRewards();
    if (!reward_data) {
      return { reward: undefined, season: this };
    }

    const reward = this._transformRewardResponse(reward_data.reward_condition);
    return { reward, season: this };
  }

  public async getClubStagesRewards(): Promise<IStageRewardEntity[]> {
    const rewards_data = await this.seasonAPI.getSeasonStagesClubRewards();
    return rewards_data.reduce<IStageRewardEntity[]>((acc, reward_data) => {
      const stage = this.getStageById(reward_data.club.stage);
      const reward = this._transformRewardResponse(reward_data.reward_condition);

      if (stage) {
        acc.push({ stage, reward });
      }

      return acc;
    }, []);
  }

  public async findClub(name: string): Promise<ISeasonsClubResponse[]> {
    const results: ISeasonsClubResponse[] = await this._findClub(name);

    for (const club of results) {
      if (club.club.lol_name.toLowerCase() === name.toLowerCase()) {
        return [club];
      }
    }

    return results;
  }

  public async toGetTopN(top = 1, params: IPointsCalculatorParams): Promise<{ games_count: number, points_needed: number }> {
    const { group_size, isARAM }: IPointsCalculatorParams = params;

    if (top < 1 || top > 500) {
      throw new Error(consts.invalidTopPosition);
    }
    if (params.group_size && (params.group_size < 2 || params.group_size > 5)) {
      throw new Error(consts.invalidPlayerCount);
    }

    const { rank: current_place, points: current_points } = await this.getClub();
    if (current_place !== 0 && current_place <= top) {
      return { games_count: 0, points_needed: 0 };
    }

    const club_on_place = await this._getClubOnTopN(top);
    if (club_on_place === undefined) {
      throw new Error(consts.errorGettingTopPosition);
    }

    const { points } = club_on_place;
    const { games_count, points_needed } = pointsCalculator(current_points, points, { group_size, isARAM });

    return { games_count, points_needed };
  }

  private async _findClub(name: string): Promise<ISeasonsClubResponse[]> {
    const searchRegExp = new RegExp(`["']?${name.replace(/["']/g, "")}["']?`, "i");
    let currentPage = 1;
    let result: ISeasonsClubResponse[] = [];

    do {
      const { nextPage, clubs } = await this._getClubsPage(currentPage);
      const clubsFound = clubs.filter((club) => searchRegExp.test(club.club.lol_name));

      result = result.concat(clubsFound);
      currentPage = nextPage;
    } while (Boolean(currentPage));

    return result;
  }

  private async _getClubsPage(number = 1): Promise<{ nextPage: number, clubs: ISeasonsClubResponse[] }> {
    const response = await this.seasonAPI.seasonQuery("clubs", { params: { per_page: 50, page: number } });
    const { results: clubs, next } = response as IPagedResponse<ISeasonsClubResponse>;
    return { nextPage: Boolean(next) ? number + 1 : 0, clubs };
  }

  private async _getClubOnTopN(top = 1): Promise<ISeasonsClubResponse> {
    const page = Math.ceil(top / 10);
    const response = await this.seasonAPI.seasonQuery("clubs", { params: { per_page: 10, page } });
    const { results: season_clubs }: { results: ISeasonsClubResponse[] } = response as IPagedResponse<ISeasonsClubResponse>;
    return season_clubs[(top - 1) % 10];
  }

  private _transformRewardResponse(reward: IRewardConditionResponse): IRewardEntity {
    return { reason: reward.description || "???", count: reward.reward_value };
  }
}
