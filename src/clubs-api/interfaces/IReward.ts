import { IStageClubResponse, ISeasonsClubResponse } from "./IClub";

export interface IRewardDescriptionResponse {
  readonly id: number;
  readonly description: string;
  readonly reward_type: number;
  readonly rules: number;
}

export interface IRewardConditionResponse {
  readonly id: number;
  readonly reward: IRewardDescriptionResponse;
  readonly description: string;
  readonly min: number;
  readonly max: number;
  readonly reward_value: number;
}

export interface IRewardResponse {
  readonly id: number;
  readonly reward_condition: IRewardConditionResponse;
}

export interface ISeasonRewardResponse extends IRewardResponse {
  readonly club: ISeasonsClubResponse;
}

export interface IStageRewardResponse extends IRewardResponse {
  readonly club: IStageClubResponse;
}