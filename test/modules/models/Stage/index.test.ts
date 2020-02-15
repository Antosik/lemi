import { Chance } from "chance";

import { mockStageResponse } from "../../../__mocks__/responses/IStage.mock";

import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

import Stage from "../../../../src/models/Stage";

const chance = new Chance();

describe("Clubs - Stage Entity", () => {
  const season_id = chance.natural({ max: 15 });
  const api = new ClubsAPIInvoker();

  const stage_data = mockStageResponse({ season_id, index: 0, is_live: false });
  const stage = new Stage(stage_data, api);

  test("isLive", () => {
    expect(stage.isLive()).toStrictEqual(stage.is_open && !stage.is_closed);
  });
});