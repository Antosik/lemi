import { ISeasonEntity } from "./ISeason";
import { IStageEntity } from "./IStage";

export interface IRewardEntity {
  reason: string;
  count: number;
}

export interface ISeasonRewardEntity {
  season: ISeasonEntity;
  reward?: IRewardEntity;
}

export interface IStageRewardEntity {
  stage: IStageEntity;
  reward: IRewardEntity;
}