import { Chance } from "chance";

import format, { locale } from "../../../src/localization";

const chance = new Chance();

describe("localization - Format", () => {
  it("pre-defined tokens", () => {
    expect.hasAssertions();

    for (const token of Object.keys(locale)) {
      const count = chance.natural();

      expect(typeof format(token, count)).toStrictEqual("string");
      expect(format(token, count).length).toBeGreaterThan(1);
    }
  });
  it("undefined token", () => {
    expect.assertions(1);

    const token = chance.string();
    const count = chance.natural();

    expect(format(token, count)).toStrictEqual("");
  });
});