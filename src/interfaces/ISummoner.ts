export interface ISummoner {
  id: number;
  lol_account_id: number;
  summoner_name: string;
  avatar: string;
  current_club: number;
}

export interface IStageSummoner {
  id: number;
  summoner: ISummoner;
  points: number;
  games: number;
  rank: number;
  joined: Date;
  left?: string;
  stage: number;
  club: number;
}

export interface ISummonerSeasonRating {
  id: number;
  points: number;
  games: number;
  club: number;
  summoner: ISummoner;
  season: number;
}