import { Chance } from "chance";
import { RichEmbed } from "discord.js";

import { mockMultiple } from "../../__mocks__/responses/helpers";
import { mockStageSummonerResponse } from "../../__mocks__/responses/ISummoner.mock";

import { generateMembersEmbed } from "../../../src/commands/members/embed";

const chance = new Chance();

describe("Commands - Members", () => {
  describe("Embed generation", () => {
    test("Format Members", () => {
      const index_start = chance.natural({ max: 10 });
      const stage_id = chance.natural({ max: 1e4 });
      const summoners = mockMultiple(() => mockStageSummonerResponse({ stage_id }));

      const embed = generateMembersEmbed(
        new RichEmbed(),
        summoners,
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