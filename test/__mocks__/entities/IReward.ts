import { IRewardResponse, ISeasonRewardResponse, IStageRewardResponse } from "../../../src/clubs-api/interfaces/IReward";
import { ISeasonResponse } from "../../../src/clubs-api/interfaces/ISeason";

import { IRewardEntity, ISeasonRewardEntity, IStageRewardEntity } from "../../../src/interfaces/IReward";

import { mockStageEntity } from "./IStage";
import { mockSeasonEntity } from "./ISeason";
import { IStageResponse } from "clubs-api/interfaces/IStage";

export const mockRewardEntity = (
  { reward_data }: { reward_data: IRewardResponse }
): IRewardEntity => ({
  count: reward_data.reward_condition.reward_value,
  reason: reward_data.reward_condition.description
})

export const mockSeasonRewardEntity = (
  { season_data, reward_data }: { season_data: ISeasonResponse, reward_data: ISeasonRewardResponse }
): ISeasonRewardEntity => ({
  season: mockSeasonEntity({ season_data }),
  reward: mockRewardEntity({ reward_data })
})

export const mockStageRewardEntity = (
  { season_id, stage_data, reward_data }: { season_id: number, stage_data: IStageResponse, reward_data: IStageRewardResponse }
): IStageRewardEntity => ({
  stage: mockStageEntity({ stage_data, season_id }),
  reward: mockRewardEntity({ reward_data })
})