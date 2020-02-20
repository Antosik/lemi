import { Chance } from "chance";

import { ESeasonArgs, EStageArgs, isSeason, isStage } from "../../../src/interfaces/IArgument";

const chance = new Chance();

describe("interfaces", () => {
  describe("isSeason", () => {
    it("valid", () => {
      expect.assertions(2);

      expect(isSeason(ESeasonArgs.ru)).toStrictEqual(true);
      expect(isSeason(ESeasonArgs.en)).toStrictEqual(true);
    });

    it("invalid", () => {
      expect.assertions(1);

      expect(isSeason(chance.string())).toStrictEqual(false);
    });
  });

  describe("isStage", () => {
    it("valid", () => {
      expect.assertions(2);
      expect(isStage(EStageArgs.ru)).toStrictEqual(true);
      expect(isStage(EStageArgs.en)).toStrictEqual(true);
    });

    it("invalid", () => {
      expect.assertions(1);

      expect(isStage(chance.string())).toStrictEqual(false);
    });
  });
});