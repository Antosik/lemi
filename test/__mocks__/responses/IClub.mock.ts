import { Chance } from "chance";

import { mockSummonerResponse } from "./ISummoner.mock";

import { IClubResponse, IParticipatingClubResponse, ISeasonsClubResponse, IStageClubResponse } from "../../../src/clubs-api/interfaces/IClub";
import { mockRewardConditionResponse } from "./IReward.mock";

const chance = new Chance();

export const mockClubResponse = (): IClubResponse => ({
  id: chance.natural({ max: 1e6 }),
  is_hiring: chance.bool(),
  lol_club_key: chance.string(),
  lol_name: chance.name({ prefix: false, suffix: false }),
  members_count: chance.natural({ max: 100 }),
  owner: mockSummonerResponse(),
  seasons_count: chance.natural({ max: 50 })
});

export const mockParticipatingClubResponse = (): IParticipatingClubResponse => ({
  id: chance.natural({ max: 1e6 }),
  club: mockClubResponse(),
  rank_reward: mockRewardConditionResponse(),
  points: chance.natural({ max: 1e5 }),
  games: chance.natural({ max: 1e3 }),
  joined: chance.date().toISOString(),
  rank: chance.natural({ min: 1, max: 100 }),
})

export const mockSeasonsClubResponse = ({ season_id }: { season_id: number }): ISeasonsClubResponse => ({
  ...mockParticipatingClubResponse(),
  season: season_id,
  completed_stages: chance.natural({ max: 100 })
});

export const mockStageClubResponse = ({ stage_id }: { stage_id: number }): IStageClubResponse => ({
  ...mockParticipatingClubResponse(),
  stage: stage_id,
  group: chance.natural({ max: 1e3 })
});

