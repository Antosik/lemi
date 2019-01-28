import Season from "./Season";
import Stage from "./Stage";

import { ICurrentSeason } from "../interfaces/ISeason";

export default class LiveSeason extends Season {
  public readonly current_stage: Stage;
  public readonly stages: Stage[];

  constructor(data: ICurrentSeason) {
    super(data);

    this.current_stage = data.current_stage ? new Stage(data.current_stage) : undefined;
    this.stages = data.stages.map((stage) => new Stage(stage));
  }

  public getStageIdByIndex(stage_index?: number): Stage {
    if (stage_index) {
      const stage = this.stages.find(({ number }) => number === stage_index);
      return stage;
    }

    return this.current_stage;
  }

  public isEnded(): boolean {
    return this.stages.every((stage) => !stage.is_live);
  }
}
