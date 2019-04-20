import { IRewardCondition } from "./IReward";

export interface IClubOwner {
  id: number;
  lol_account_id: number;
  summoner_name: string;
  avatar: string;
  current_club: number;
}

export interface IClub {
  id: number;
  owner: IClubOwner;
  lol_club_key: string;
  lol_name: string;
  is_hiring: boolean;
  members_count: number;
  seasons_count: number;
}

export interface IParticipatingClub {
  id: number;
  club: IClub;
  rank_reward: IRewardCondition;
  points: number;
  games: number;
  rank: number;
  joined: Date;
  season: number;
}

export interface ISeasonsClub extends IParticipatingClub {
  completed_stages: number;
}

export interface IStageClub extends IParticipatingClub {
  stage: number;
  group: number;
}
