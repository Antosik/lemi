import { Chance } from "chance";

import { ESeasonArgs, EStageArgs, isSeason, isStage } from "../../../src/interfaces/IArgument";

const chance = new Chance();

describe("Interfaces", () => {
  describe("isSeason", () => {
    test("valid", () => {
      expect(isSeason(ESeasonArgs.ru)).toBeTruthy();
      expect(isSeason(ESeasonArgs.en)).toBeTruthy();
    });

    test("invalid", () => {
      expect(isSeason(chance.string())).toBeFalsy();
    });
  });
  
  describe("isStage", () => {
    test("valid", () => {
      expect(isStage(EStageArgs.ru)).toBeTruthy();
      expect(isStage(EStageArgs.en)).toBeTruthy();
    });
    
    test("invalid", () => {
      expect(isStage(chance.string())).toBeFalsy();
    });
  })
})