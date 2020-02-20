import { Chance } from "chance";

import { EStageModeResponse, IStageResponse } from "../../../src/clubs-api/interfaces/IStage";

const chance = new Chance();

export const mockStageModeResponse = (): EStageModeResponse => {
  const variants: EStageModeResponse[] = [EStageModeResponse.registration, EStageModeResponse.team_init, EStageModeResponse.main];
  return variants[chance.natural({ max: variants.length })];
};

export function mockStageResponse(
  { season_id, index, is_live }: { season_id: number, index: number, is_live: boolean }
): IStageResponse {
  return {
    id: chance.natural({ max: 1e4 }),
    season: season_id,
    start_date: chance.date().toISOString(),
    end_date: chance.date().toISOString(),
    number: index,
    is_open: is_live,
    is_closed: !is_live,
    status: chance.natural({ max: 10 }),
    mode: mockStageModeResponse()
  };
}
