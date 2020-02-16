import { IStageResponse } from "../../../src/clubs-api/interfaces/IStage";
import { IStageEntity } from "../../../src/interfaces/IStage";

export const mockStageEntity = (
  { stage_data, season_id }: { stage_data: IStageResponse, season_id: number }
): IStageEntity => ({
  ...stage_data,
  season_id,
  stage_id: stage_data.id,
  isLive: () => true,
  index: stage_data.number,
  start_date: new Date(Date.now() - 1e6),
  end_date: new Date()
})