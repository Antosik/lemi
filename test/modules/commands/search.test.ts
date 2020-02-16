import { Chance } from "chance";

import { mockSeasonsClubResponse, mockStageClubResponse, mockParticipatingClubResponse } from "../../__mocks__/responses/IClub.mock";
import { mockMultiple } from "../../__mocks__/responses/helpers";

import { generateFoundMultipleClubsEmbed, generateFoundOneClubEmbed } from "../../../src/commands/search/embed";

const chance = new Chance();

describe("Commands - Search", () => {
  describe("Embed generation", () => {
    const season_id = chance.natural({ max: 1e4 });

    test("Many clubs", () => {
      const clubs = mockMultiple(() => mockSeasonsClubResponse({ season_id }));

      const embed = generateFoundMultipleClubsEmbed({ query: "", clubs });
      const json = JSON.parse(JSON.stringify(embed));

      expect(json).toMatchObject({
        title: expect.any(String),
        author: expect.any(Object),
        color: expect.any(Number),
        fields: expect.any(Array),
        footer: expect.any(Object)
      });
      expect(json.title).toContain(`Найдено ${clubs.length}`)
      expect(json.fields).toHaveLength(clubs.length);
    });

    test("One club", () => {
      const stage_id = chance.natural({ max: 1e4 });
      const stage_index = chance.natural({ min: 1, max: 5 });

      const part_club = mockParticipatingClubResponse();
      const club_season = { ...mockSeasonsClubResponse({ season_id }), ...part_club };
      const club_stage = { ...mockStageClubResponse({ stage_id }), ...part_club };

      const embed = generateFoundOneClubEmbed({ club_season, club_stage, stage_index });
      const json = JSON.parse(JSON.stringify(embed));

      expect(json).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
        color: expect.any(Number),
        fields: expect.any(Array),
      });
      expect(json.title).toContain(part_club.club.lol_name);
      expect(json.description).toContain(part_club.club.owner.summoner_name);
      expect(json.description).toContain(`${part_club.club.members_count} участн`);
      expect(json.description).toContain(`${part_club.club.seasons_count} сезон`);
      expect(json.fields).toHaveLength(3);
    });
  });
});