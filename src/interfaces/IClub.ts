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
  rank_reward: IRankReward;
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

export interface IReward {
  id: number;
  description: string;
  reward_type: number;
  rules: number;
}

export interface IRankReward {
  id: number;
  reward: IReward;
  min: number;                     // bottom corner of place
  max: number;                     // top corner of place
  reward_value: number;            // count of rewards
}
