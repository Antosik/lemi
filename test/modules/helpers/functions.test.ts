import { Chance } from "chance";

import { boldIF, underlineIF, capitalizeFirstLetter, isValidURL } from "../../../src/helpers/functions";

const chance = new Chance();

describe("helpers - Functions", () => {
  it("boldIF", () => {
    expect.assertions(2);

    const text = chance.string();

    expect(boldIF(text, true)).toStrictEqual(`**${text}**`);
    expect(boldIF(text, false)).toStrictEqual(text);
  });

  it("underlineIF", () => {
    expect.assertions(2);

    const text = chance.string();

    expect(underlineIF(text, true)).toStrictEqual(`__${text}__`);
    expect(underlineIF(text, false)).toStrictEqual(text);
  });

  it("isValidURL", () => {
    expect.assertions(2);

    expect(isValidURL(chance.url())).toStrictEqual(true);
    expect(isValidURL(chance.string())).toStrictEqual(false);
  });

  it("capitalizeFirstLetter", () => {
    expect.assertions(1);

    const text = chance.string({ casing: "lower", symbols: false });
    const capitalized = capitalizeFirstLetter(text);

    expect(capitalized[0]).toStrictEqual(text[0].toUpperCase());
  });
});