import { IStage } from "../interfaces/IStage";
import { parse } from "date-fns";


export default class Stage {
  public readonly id: number;
  public readonly number: number;
  public readonly season: number;
  public readonly start_date: Date;
  public readonly end_date: Date;
  public readonly is_live: boolean;

  constructor(data: IStage) {
    this.id = data.id;
    this.number = data.number;
    this.season = data.season;
    this.start_date = parse(data.start_date, "yyyy-MM-dd", new Date(data.start_date));
    this.end_date = parse(data.end_date, "yyyy-MM-dd", new Date(data.end_date));
    this.is_live = data.is_open && !data.is_closed;
  }
}