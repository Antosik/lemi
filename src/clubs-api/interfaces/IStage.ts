export const enum EStageModeResponse {
  registration = "registration",
  team_init = "team_init",
  main = "main"
}

export interface IStageResponse {
  readonly id: number;
  readonly season: number;
  readonly start_date: string;
  readonly end_date: string;
  readonly number: number;
  readonly is_open: boolean;
  readonly is_closed: boolean;
  readonly status: number;
  readonly mode: EStageModeResponse;
}
