import { IStageClub } from "./IClub";

export interface IRewardDescription {
  id: number;
  description: string;
  reward_type: number;
  rules: number;
}

export interface IRewardCondition {
  id: number;
  reward: IRewardDescription;
  description?: string;
  min: number;
  max: number;
  reward_value: 1;
}

export interface IReward {
  id: number;
  club: IStageClub;
  reward_condition: IRewardCondition;
}
