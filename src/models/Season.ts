import co from "co";
import { parse } from "date-fns";

import { ISeasonsClub } from "../interfaces/IClub";
import { ISeason } from "../interfaces/ISeason";
import { IStage } from "../interfaces/IStage";

import { ClubsAPICaller } from "../helpers/clubs-api";

import Stage from "./Stage";

export default class Season extends ClubsAPICaller {
  public readonly id: number;
  public readonly title: string;
  public readonly start_date: Date;
  public readonly end_date: Date;
  public readonly is_live: boolean;

  constructor(data: ISeason, token?: string) {
    super(token);

    this.id = data.id;
    this.title = data.title.trim();
    this.start_date = parse(data.start_date, "yyyy-MM-dd", new Date(data.start_date));
    this.end_date = parse(data.end_date, "yyyy-MM-dd", new Date(data.end_date));
    this.is_live = data.is_open && !data.is_closed;
  }

  public async getStages(): Promise<Stage[]> {
    const stages: IStage[] = await this.query(`contest/season/${this.id}/stages`);
    return stages.map((stage) => new Stage(stage));
  }

  public async getTopN(count: number = 10, page: number = 1): Promise<ISeasonsClub[]> {
    const { results: seasons_clubs }: { results: ISeasonsClub[] } = await this.query(`contest/season/${this.id}/clubs`, { params: { per_page: count, page } });
    return seasons_clubs;
  }

  public async findClub(name: string): Promise<ISeasonsClub[]> {
    const results: ISeasonsClub[] = await co(this.clubSearcher(name));

    for (const club of results) {
      if (club.club.lol_name.toLowerCase() === name.toLowerCase()) {
        return [club];
      }
    }

    return results;
  }

  private * clubSearcher(name: string) {
    const searchRegExp = new RegExp(`["']?${name.replace(/["']/g, "")}["']?`, "i");
    let currentPage = 1;
    let result: ISeasonsClub[] = [];

    do {
      const { nextPage, clubs }: { nextPage: number, clubs: ISeasonsClub[] } = yield this.getClubsPage(currentPage);
      const clubsFound = clubs.filter((club) => searchRegExp.test(club.club.lol_name));

      result = result.concat(clubsFound);
      currentPage = nextPage;
    } while (Boolean(currentPage));

    return result;
  }

  private async getClubsPage(number = 1): Promise<{ nextPage: number, clubs: ISeasonsClub[] }> {
    const { results: clubs, next }: { results: ISeasonsClub[], next: string } = await this.query(`contest/season/${this.id}/clubs`, { params: { per_page: 50, page: number } });
    return { nextPage: Boolean(next) ? number + 1 : 0, clubs };
  }
}
