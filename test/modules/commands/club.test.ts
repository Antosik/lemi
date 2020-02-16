import { Chance } from "chance";

import { mockSeasonsClubResponse, mockStageClubResponse } from "../../__mocks__/responses/IClub.mock";

import { generateClubEmbed } from "../../../src/commands/club/embed";

const chance = new Chance();

describe("Commands - Club", () => {
  describe("Embed generation", () => {
    const season_id = chance.natural({ max: 1e4 });
    const stage_id = chance.natural({ max: 1e4 });
    const stage_index = chance.natural({ min: 1, max: 10 });
    const homeclub_season = mockSeasonsClubResponse({ season_id });
    const homeclub_stage = mockStageClubResponse({ stage_id });


    test("Stage - Not participating", () => {
      const embed = generateClubEmbed({ homeclub_season, homeclub_stage, stage_index });
      const json = JSON.parse(JSON.stringify(embed));

      expect(json).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
        color: expect.any(Number),
        fields: expect.any(Array)
      });

      expect(json.title).toContain(homeclub_season.club.lol_name);
      expect(json.description).toContain(homeclub_season.club.owner.summoner_name);
      expect(json.description).toContain(`${homeclub_season.club.members_count} участн`);
      expect(json.description).toContain(`${homeclub_season.club.seasons_count} сезон`);
      expect(json.fields).toHaveLength(3);
    });

    test("Stage - Participating", () => {
      const embed = generateClubEmbed({ homeclub_season, homeclub_stage: undefined, stage_index });
      const json = JSON.parse(JSON.stringify(embed));

      expect(json).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
        color: expect.any(Number),
        fields: expect.any(Array)
      });

      expect(json.title).toContain(homeclub_season.club.lol_name);
      expect(json.description).toContain(homeclub_season.club.owner.summoner_name);
      expect(json.description).toContain(`${homeclub_season.club.members_count} участн`);
      expect(json.description).toContain(`${homeclub_season.club.seasons_count} сезон`);
      expect(json.fields).toHaveLength(2);
    });
  });
});