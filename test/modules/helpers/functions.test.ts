import { Chance } from "chance";

import { boldIF, underlineIF, capitalizeFirstLetter, isValidURL } from "../../../src/helpers/functions";

const chance = new Chance();

describe("Helpers - Functions", () => {
  test("boldIF", () => {
    const text = chance.string();

    expect(boldIF(text, true)).toStrictEqual(`**${text}**`);
    expect(boldIF(text, false)).toStrictEqual(text);
  });

  test("underlineIF", () => {
    const text = chance.string();

    expect(underlineIF(text, true)).toStrictEqual(`__${text}__`);
    expect(underlineIF(text, false)).toStrictEqual(text);
  });

  test("isValidURL", () => {
    expect(isValidURL(chance.url())).toBeTruthy();
    expect(isValidURL(chance.string())).toBeFalsy();
  });

  test("capitalizeFirstLetter", () => {
    const text = chance.string({ casing: "lower", symbols: false });
    const capitalized = capitalizeFirstLetter(text);

    expect(capitalized[0]).toStrictEqual(text[0].toUpperCase());;
  });
});