import { Chance } from "chance";

import { mockStageSummonerResponse } from "../../__mocks__/responses/ISummoner.mock";
import { mockMultiple } from "../../__mocks__/responses/helpers";

import { generateFoundManyMembersEmbed, generateFoundOneMemberEmbed } from "../../../src/commands/member/embed";

const chance = new Chance();

describe("Commands - Member", () => {
  describe("Embed generation", () => {
    const stage_id = chance.natural({ max: 1e4 });

    test("Many member", () => {
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
      expect(json.title).toContain(`Найдено ${members.length}`)
      expect(json.fields).toHaveLength(members.length);
    });

    test("One members", () => {
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