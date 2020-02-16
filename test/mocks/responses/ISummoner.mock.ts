import { Chance } from "chance";

import { ISummonerResponse, ISummonerRatingResponse, ISummonerSeasonRatingResponse, ISummonerStageRatingResponse, IStageSummonerResponse } from "../../../src/clubs-api/interfaces/ISummoner";

const chance = new Chance();

export const mockSummonerResponse = (): ISummonerResponse => ({
  id: chance.natural({ max: 1e6 }),
  avatar: chance.url(),
  lol_account_id: chance.natural({ max: 1e6 }),
  summoner_name: chance.name(),
  current_club: chance.natural({ max: 1e6 })
});


const mockSummonerRatingResponse = (): ISummonerRatingResponse => ({
  id: chance.natural({ max: 1e6 }),
  points: chance.natural({ max: 1e5 }),
  games: chance.natural({ max: 1e4 }),
  club: chance.natural({ max: 1e6 }),
  summoner: mockSummonerResponse(),
});


export const mockStageSummonerResponse = ({ stage_id }: { stage_id: number }): IStageSummonerResponse => ({
  ...mockSummonerRatingResponse(),
  rank: chance.natural({ max: 20 }),
  joined: chance.date().toISOString(),
  left: undefined,
  stage: stage_id,
});

export const mockSummonerSeasonRatingResponse = ({ season_id }: { season_id: number }): ISummonerSeasonRatingResponse => ({
  ...mockSummonerRatingResponse(),
  season: season_id,
});

export const mockSummonerStageRatingResponse = ({ stage_id }: { stage_id: number }): ISummonerStageRatingResponse => ({
  ...mockSummonerRatingResponse(),
  stage: stage_id,
});