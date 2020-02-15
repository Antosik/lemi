import { Chance } from "chance";

import format, { locale } from "../../../src/localization";

const chance = new Chance();

describe("Localization - Format", () => {
  test("Pre-defined tokens", () => {
    for (const token of Object.keys(locale)) {
      const count = chance.natural();

      expect(typeof format(token, count)).toStrictEqual("string");
      expect(format(token, count).length).toBeGreaterThan(1);
    }
  });
  test("Undefined token", () => {
    const token = chance.string();
    const count = chance.natural();

    expect(format(token, count)).toStrictEqual("");
  })
});