import axios from "axios";
import co from "co";
import { parse } from "date-fns";

import { ISeason, ICurrentSeason } from "../interfaces/ISeason";
import { ISeasonsClub } from "../interfaces/IClub";

import Stage from "./Stage";
import { consts } from "../localization";

export default class Season {
  public static readonly endpoint = "https://clubs.ru.leagueoflegends.com/api/contest/season";

  public readonly id: number;
  public readonly title: string;
  public readonly start_date: Date;
  public readonly end_date: Date;
  public readonly is_live: boolean;

  constructor(data: ISeason) {
    this.id = data.id;
    this.title = data.title.trim();
    this.start_date = parse(data.start_date, "yyyy-MM-dd", new Date(data.start_date));
    this.end_date = parse(data.end_date, "yyyy-MM-dd", new Date(data.end_date));
    this.is_live = data.is_open && !data.is_closed;
  }

  public async getStages(): Promise<Stage[]> {
    const stages = await this.query(`${this.id}/stages`);
    return stages.map(stage => new Stage(stage));
  }

  public async getTopN(count: number = 10): Promise<ISeasonsClub[]> {
    const { results: seasons_clubs }: { results: ISeasonsClub[] } = await this.query(`${this.id}/clubs`, { params: { per_page: count } });
    return seasons_clubs;
  }

  protected async query(query, { data = {}, params = {}, headers = {} } = { data: {}, params: {}, headers: {} }): Promise<any> {
    return axios.get(`${Season.endpoint}/${query}/`, { params, data, headers })
      .then(({ data: result }) => result)
      .catch(() => { throw new Error(consts.requestError); })
  }

  public async findClub(name: string): Promise<ISeasonsClub[]> {
    const results: ISeasonsClub[] = await co(this.clubSearcher(name));

    for (let club of results) {
      if (club.club.lol_name.toLowerCase() === name.toLowerCase()) {
        return [club]
      }
    }

    return results;
  }

  private * clubSearcher(name: string) {
    const searchRegExp = new RegExp(name, "i");
    let currentPage = 1;
    let result: ISeasonsClub[] = [];

    do {
      let { nextPage, clubs }: { nextPage: number, clubs: ISeasonsClub[] } = yield this.getClubsPage(currentPage);
      const clubsFound = clubs.filter(club => searchRegExp.test(club.club.lol_name));

      result = result.concat(clubsFound);
      currentPage = nextPage;
    } while (Boolean(currentPage));

    return result;
  }

  private async getClubsPage(number = 1): Promise<{ nextPage: number, clubs: ISeasonsClub[] }> {
    const { results: clubs, next }: { results: ISeasonsClub[], next: string } = await this.query(`${this.id}/clubs`, { params: { per_page: 50, page: number } });
    return { nextPage: Boolean(next) ? number + 1 : 0, clubs };
  }
}

export class LiveSeason extends Season {
  public readonly current_stage: Stage;
  public readonly stages: Stage[];

  constructor(data: ICurrentSeason) {
    super(data);

    this.current_stage = data.current_stage ? new Stage(data.current_stage) : null;
    this.stages = data.stages.map(stage => new Stage(stage));
  }

  public getStageIdByIndex(stage_index?: number): Stage {
    if (stage_index) {
      const stage = this.stages.find(({ number }) => number === stage_index);
      return stage;
    }

    return this.current_stage;
  }

  public isEnded(): boolean {
    return this.stages.every(stage => !stage.is_live);
  }
}