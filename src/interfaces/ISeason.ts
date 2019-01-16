import { IStage } from "./IStage";

export interface ISeason {
  id: number;
  rules: number;
  start_date: string;
  end_date: string;
  title: string;
  is_open: boolean;
  is_closed: boolean;
  status: number;
}

export interface ICurrentSeason extends ISeason {
  current_stage: IStage;
  stages: IStage[];
}