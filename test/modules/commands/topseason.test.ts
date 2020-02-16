import { Chance } from "chance";
import { RichEmbed } from "discord.js";

import { mockSeasonEntity } from "../../mocks/entities/ISeason";
import { mockSeasonsClubResponse } from "../../mocks/responses/IClub.mock";
import { mockCurrentSeasonResponse } from "../../mocks/responses/ISeason.mock";
import { mockMultiple } from "../../mocks/responses/helpers";

import { generateTopseasonEmbed, generateTopseasonTemplateEmbed } from "../../../src/commands/topseason/embed";

const chance = new Chance();

describe("commands - TopSeason", () => {
  describe("embed generation", () => {
    it("template", () => {
      expect.assertions(2);

      const season_data = mockCurrentSeasonResponse();
      const live_season = mockSeasonEntity({ season_data });

      const embed = generateTopseasonTemplateEmbed(
        new Date().toLocaleString(),
        { live_season }
      );
      const json = JSON.parse(JSON.stringify(embed));

      expect(json).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
        color: expect.any(Number),
        footer: expect.any(Object)
      });
      expect(json.description).toContain(`Сезон "${live_season.title}"`);
    });

    it("season clubs", () => {
      expect.assertions(2);

      const season_id = chance.natural({ max: 1e4 });
      const clubs = mockMultiple(() => mockSeasonsClubResponse({ season_id }));

      const embed = generateTopseasonEmbed(
        new RichEmbed(),
        clubs
      );
      const json = JSON.parse(JSON.stringify(embed));

      expect(json).toMatchObject({
        fields: expect.any(Array),
      });
      expect(json.fields).toHaveLength(clubs.length);
    });
  });
});