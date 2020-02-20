import { Chance } from "chance";

import { generateStageEmbed, generateStageTemplateEmbed } from "../../../src/commands/stage/embed";
import { mockCurrentSeasonResponse } from "../../mocks/responses/ISeason.mock";
import { mockSeasonEntity } from "../../mocks/entities/ISeason";
import { RichEmbed } from "discord.js";
import { mockStageClubResponse } from "../../mocks/responses/IClub.mock";
import { mockMultiple } from "../../mocks/responses/helpers";

const chance = new Chance();

describe("commands - Stage", () => {
  describe("embed generation", () => {
    it("template", () => {
      expect.assertions(3);

      const season_data = mockCurrentSeasonResponse();
      const live_season = mockSeasonEntity({ season_data });
      const stage = live_season.stages[0];

      const embed = generateStageTemplateEmbed(
        new Date().toLocaleString(),
        { live_season, stage }
      );
      const json = JSON.parse(JSON.stringify(embed));

      expect(json).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
        color: expect.any(Number),
        footer: expect.any(Object)
      });
      expect(json.description).toContain(`Сезон "${live_season.title}"`);
      expect(json.description).toContain(`Этап ${stage.index}`);
    });

    it("stage clubs", () => {
      expect.assertions(2);

      const stage_id = chance.natural({ max: 1e4 });
      const clubs = mockMultiple(() => mockStageClubResponse({ stage_id }));
      const homeclub_id = clubs[clubs.length - 1].club.id;

      const embed = generateStageEmbed(
        new RichEmbed(),
        clubs,
        homeclub_id
      );
      const json = JSON.parse(JSON.stringify(embed));

      expect(json).toMatchObject({
        fields: expect.any(Array),
      });
      expect(json.fields).toHaveLength(clubs.length);
    });
  });
});