import { Chance } from "chance";
import { RichEmbed } from "discord.js";

import { mockStageClubResponse } from "../../mocks/responses/IClub.mock";
import { mockSeasonResponse } from "../../mocks/responses/ISeason.mock";
import { mockSeasonEntity } from "../../mocks/entities/ISeason";
import { mockStageSummonerResponse } from "../../mocks/responses/ISummoner.mock";
import { mockMultiple } from "../../mocks/responses/helpers";

import { generateFarmTemplateEmbed, formatDeficiencyMembers } from "../../../src/commands/farm/embed";

const chance = new Chance();

describe("commands - Farm", () => {
  describe("embed generation", () => {
    const points = chance.natural({ max: 1e5 });

    it("generate Template", () => {
      expect.assertions(5);

      const live_season = mockSeasonResponse({ is_live: true });
      const live_stage = live_season.stages[live_season.stages.length - 1];
      const homeclub = mockStageClubResponse({ stage_id: live_stage.id });

      const season_entity = mockSeasonEntity({ season_data: live_season });
      const stage_entity = season_entity.stages[live_season.stages.length - 1];

      const embed = generateFarmTemplateEmbed(points, new Date().toLocaleString(), {
        live_season: season_entity,
        live_stage: stage_entity,
        homeclub
      });
      const json = JSON.parse(JSON.stringify(embed));

      expect(json).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
        color: expect.any(Number),
        footer: expect.any(Object)
      });

      expect(json.title).toContain(homeclub.club.lol_name);
      expect(json.title).toContain(`${points}pt`);
      expect(json.description).toContain(`Сезон "${live_season.title}"`);
      expect(json.description).toContain(`${live_stage.number}`);
    });

    it("format Members", () => {
      expect.assertions(2);

      const index_start = chance.natural({ max: 10 });
      const stage_id = chance.natural({ max: 1e4 });
      const summoners = mockMultiple(() => mockStageSummonerResponse({ stage_id }));

      const embed = formatDeficiencyMembers(
        new RichEmbed(),
        summoners,
        points,
        index_start
      );
      const json = JSON.parse(JSON.stringify(embed));

      expect(json).toMatchObject({
        fields: expect.any(Array)
      });
      expect(json.fields).toHaveLength(summoners.length);
    });
  });
});