import { EStageModeResponse } from "../clubs-api/interfaces/IStage";

export interface IStageEntity {
  readonly stage_id: number;
  readonly season_id: number;

  readonly index: number;
  readonly start_date: Date;
  readonly end_date: Date;
  readonly is_open: boolean;
  readonly is_closed: boolean;

  readonly mode: EStageModeResponse;

  isLive(): boolean;
}