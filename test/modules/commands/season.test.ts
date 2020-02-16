import { mockSeasonEntity } from "../../__mocks__/entities/ISeason";
import { mockCurrentSeasonResponse } from "../../__mocks__/responses/ISeason.mock";

import { generateSeasonEmbed } from "../../../src/commands/season/embed";

describe("Commands - Help", () => {
  test("Embed generation", () => {
    const season_data = mockCurrentSeasonResponse();
    const live_season = mockSeasonEntity({ season_data });

    const embed = generateSeasonEmbed({ live_season, stages: live_season.stages });
    const json = JSON.parse(JSON.stringify(embed));

    expect(json).toMatchObject({
      title: expect.any(String),
      description: expect.any(String),
      color: expect.any(Number),
      fields: expect.any(Array),
    });
    expect(json.title).toContain(live_season.title)
    expect(json.fields).toHaveLength(live_season.stages.length);
  });
});