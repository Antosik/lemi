import { Chance } from "chance";

import { IRewardConditionResponse, ISeasonRewardResponse, IRewardDescriptionResponse, IStageRewardResponse } from "../../../src/clubs-api/interfaces/IReward";
import { mockStageClubResponse, mockSeasonsClubResponse } from "./IClub.mock";

const chance = new Chance();

export const mockRewardDescriptionResponse = (): IRewardDescriptionResponse => ({
  id: chance.natural({ max: 1e6 }),
  description: chance.string(),
  reward_type: chance.natural({ max: 10 }),
  rules: chance.natural({ max: 10 })
});

export const mockRewardConditionResponse = (): IRewardConditionResponse => ({
  id: chance.natural({ max: 1e6 }),
  description: chance.string(),
  min: chance.natural({ max: 10 }),
  max: chance.natural({ min: 10, max: 20 }),
  reward: mockRewardDescriptionResponse(),
  reward_value: chance.natural({ min: 0, max: 20 })
});

export const mockStageRewardResponse = ({ stage_id }: { stage_id: number }): IStageRewardResponse => ({
  id: chance.natural({ max: 1e6 }),
  club: mockStageClubResponse({ stage_id }),
  reward_condition: mockRewardConditionResponse()
});

export const mockSeasonRewardResponse = ({ season_id }: { season_id: number }): ISeasonRewardResponse => ({
  id: chance.natural({ max: 1e6 }),
  club: mockSeasonsClubResponse({ season_id }),
  reward_condition: mockRewardConditionResponse()
});