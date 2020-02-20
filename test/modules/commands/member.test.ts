import { Chance } from "chance";

import { mockStageSummonerResponse } from "../../mocks/responses/ISummoner.mock";
import { mockMultiple } from "../../mocks/responses/helpers";

import { generateFoundManyMembersEmbed, generateFoundOneMemberEmbed } from "../../../src/commands/member/embed";

const chance = new Chance();

describe("commands - Member", () => {
  describe("embed generation", () => {
    const stage_id = chance.natural({ max: 1e4 });

    it("many member", () => {
      expect.assertions(3);

      const members = mockMultiple(() => mockStageSummonerResponse({ stage_id }));

      const embed = generateFoundManyMembersEmbed(members);
      const json = JSON.parse(JSON.stringify(embed));

      expect(json).toMatchObject({
        title: expect.any(String),
        author: expect.any(Object),
        color: expect.any(Number),
        fields: expect.any(Array),
        footer: expect.any(Object)
      });
      expect(json.title).toContain(`Найдено ${members.length}`);
      expect(json.fields).toHaveLength(members.length);
    });

    it("one members", () => {
      expect.assertions(3);

      const stage_index = chance.natural({ max: 5 });
      const list_index = chance.natural({ max: 20 });
      const member = mockStageSummonerResponse({ stage_id });

      const embed = generateFoundOneMemberEmbed(member, { stage_index, list_index });
      const json = JSON.parse(JSON.stringify(embed));

      expect(json).toMatchObject({
        title: expect.any(String),
        color: expect.any(Number),
        fields: expect.any(Array),
        thumbnail: expect.any(Object)
      });
      expect(json.title).toContain(member.summoner.summoner_name);
      expect(json.fields).toHaveLength(2);
    });
  });
});