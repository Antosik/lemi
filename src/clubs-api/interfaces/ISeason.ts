import { IStageResponse } from "./IStage";

export interface ISeasonResponse {
  readonly id: number;
  readonly rules: number;
  readonly start_date: string;
  readonly end_date: string;
  readonly title: string;
  readonly is_open: boolean;
  readonly is_closed: boolean;
  readonly status: number;
  readonly stages: IStageResponse[];
}

export interface ICurrentSeasonResponse extends ISeasonResponse {
  readonly current_stage?: IStageResponse;
}
