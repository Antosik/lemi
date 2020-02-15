export interface ISummonerResponse {
  readonly id: number;
  readonly lol_account_id: number;
  readonly summoner_name: string;
  readonly avatar: string;
  readonly current_club?: number;
}


export interface ISummonerRatingResponse {
  readonly id: number;
  readonly points: number;
  readonly games: number;
  readonly club: number;
  readonly summoner: ISummonerResponse;
}

export interface IStageSummonerResponse extends ISummonerRatingResponse {
  readonly rank: number;
  readonly joined: string;
  readonly left?: string;
  readonly stage: number;
}

export interface ISummonerStageRatingResponse extends ISummonerRatingResponse {
  readonly stage: number;
}

export interface ISummonerSeasonRatingResponse extends ISummonerRatingResponse {
  readonly season: number;
}