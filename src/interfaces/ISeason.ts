import { IStageEntity } from "./IStage";

export interface ISeasonEntity {
  readonly season_id: number;
  readonly title: string;

  readonly start_date: Date;
  readonly end_date: Date;
  readonly is_open: boolean;
  readonly is_closed: boolean;

  readonly stages: IStageEntity[];

  isLive(): boolean;
}