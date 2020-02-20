import { IRewardConditionResponse } from "./IReward";
import { ISummonerResponse } from "./ISummoner";

export type IClubOwnerResponse = ISummonerResponse;

export interface IClubResponse {
  readonly id: number;
  readonly owner: IClubOwnerResponse;
  readonly lol_name: string;
  readonly lol_club_key: string;
  readonly is_hiring: boolean;
  readonly members_count: number;
  readonly seasons_count: number;
}

export interface IParticipatingClubResponse {
  readonly id: number;
  readonly club: IClubResponse;
  readonly rank_reward: IRewardConditionResponse;
  readonly points: number;
  readonly games: number;
  readonly rank: number;
  readonly joined: string;
}

export interface ISeasonsClubResponse extends IParticipatingClubResponse {
  readonly season: number;
  readonly completed_stages: number;
}

export interface IStageClubResponse extends IParticipatingClubResponse {
  readonly stage: number;
  readonly group: number;
}
