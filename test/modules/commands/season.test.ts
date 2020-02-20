import { mockSeasonEntity } from "../../mocks/entities/ISeason";
import { mockCurrentSeasonResponse } from "../../mocks/responses/ISeason.mock";

import { generateSeasonEmbed } from "../../../src/commands/season/embed";

describe("commands - Help", () => {
  it("embed generation", () => {
    expect.assertions(3);

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
    expect(json.title).toContain(live_season.title);
    expect(json.fields).toHaveLength(live_season.stages.length);
  });
});