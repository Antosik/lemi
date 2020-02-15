export interface ISummonerResponse {
  readonly id: number;
  readonly lol_account_id: number;
  readonly summoner_name: string;
  readonly avatar: string;
  readonly current_club?: number;
}

export interface IStageSummonerResponse {
  readonly id: number;
  readonly summoner: ISummonerResponse;
  readonly points: number;
  readonly games: number;
  readonly rank: number;
  readonly joined: string;
  readonly left?: string;
  readonly stage: number;
  readonly club: number;
}

export interface ISummonerStageRatingResponse {
  readonly id: number;
  readonly points: number;
  readonly games: number;
  readonly club: number;
  readonly summoner: ISummonerResponse;
  readonly stage: number;
}

export interface ISummonerSeasonRatingResponse {
  readonly id: number;
  readonly points: number;
  readonly games: number;
  readonly club: number;
  readonly summoner: ISummonerResponse;
  readonly season: number;
}