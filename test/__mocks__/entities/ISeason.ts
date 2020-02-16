import { ISeasonResponse } from "../../../src/clubs-api/interfaces/ISeason";
import { ISeasonEntity } from "../../../src/interfaces/ISeason";

import { mockMultiple } from "../responses/helpers";

import { mockStageEntity } from "./IStage";

export const mockSeasonEntity = (
  { season_data }: { season_data: ISeasonResponse }
): ISeasonEntity => ({
  ...season_data,
  season_id: season_data.id,
  isLive: () => true,
  start_date: new Date(Date.now() - 1e6),
  end_date: new Date(),
  stages: mockMultiple((_, i) => mockStageEntity({
    season_id: season_data.id,
    stage_data: season_data.stages[i]
  }), season_data.stages.length)
})