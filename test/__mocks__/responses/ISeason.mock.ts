import { Chance } from "chance";

import { ISeasonResponse, ICurrentSeasonResponse } from "../../../src/clubs-api/interfaces/ISeason";
import { mockStageResponse } from "./IStage.mock";
import { mockMultiple } from "./helpers";

const chance = new Chance();

export const mockSeasonResponse = ({ is_live }: { is_live: boolean } = { is_live: chance.bool() }): ISeasonResponse => {
  const id = chance.natural({ max: 1e4 });
  const season: ISeasonResponse = {
    id,
    title: chance.name(),
    start_date: chance.date().toISOString(),
    end_date: chance.date().toISOString(),
    is_open: is_live,
    is_closed: !is_live,
    status: chance.natural({ max: 10 }),
    rules: chance.natural({ max: 10 }),
    stages: Array.from({ length: chance.natural({ min: 2, max: 5 }) })
      .map((_, index) =>
        mockStageResponse({
          season_id: id,
          index,
          is_live
        })
      )
  }
  return season;
};

export const mockCurrentSeasonResponse = (): ICurrentSeasonResponse => {
  const season = mockSeasonResponse({ is_live: true });
  const current_stage = season.stages.find(stage => stage.is_open && !stage.is_closed);
  return { ...season, current_stage };
};

export const mockSeasonsResponse = (): ISeasonResponse[] => {
  const seasons = mockMultiple(() => mockSeasonResponse({ is_live: false }));
  const live_season = mockCurrentSeasonResponse();
  return [...seasons, live_season];
};