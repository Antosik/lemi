import { ICurrentSeasonResponse } from "../clubs-api/interfaces/ISeason";
import { ClubsAPIInvoker } from "../clubs-api/helpers/api-invoker";

import Season from "./Season";
import Stage from "./Stage";

import { consts } from "../localization";

export default class LiveSeason extends Season {
  public readonly current_stage?: Stage;

  constructor(data: ICurrentSeasonResponse, api: ClubsAPIInvoker) {
    super(data, api);

    this.current_stage = data.current_stage ? new Stage(data.current_stage, api) : undefined;
  }

  public getStageByIndex(index?: number): Stage | undefined {
    if (index === undefined) {
      return this.current_stage;
    }

    const stage = this.stages.find(({ index: i }) => index === i);
    if (stage === undefined) {
      throw new Error(consts.stageNotFound);
    }
    return stage;
  }
}
