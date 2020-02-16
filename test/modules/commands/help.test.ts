import { Chance } from "chance";
import { Collection } from "discord.js";

import { ICommand } from "../../../src/interfaces/ICommand";
import { generateHelpEmbed } from "../../../src/commands/help/embed";

const chance = new Chance();

describe("Commands - Help", () => {
  test("Embed generation", () => {
    const prefix = chance.string({ length: 3 });
    const commands = new Collection([]) as Collection<string, ICommand>;

    const embed = generateHelpEmbed({ prefix, commands });
    const json = JSON.parse(JSON.stringify(embed));

    expect(json).toMatchObject({
      title: expect.any(String),
      description: expect.any(String),
      color: expect.any(Number),
      fields: expect.any(Array),
      footer: expect.any(Object)
    });
    expect(json.description).toContain(`префикс \`${prefix}\``);
    expect(json.fields).toHaveLength(commands.size);
  });
});