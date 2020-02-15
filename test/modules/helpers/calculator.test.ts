import { Chance } from "chance";

import { pointsCalculator } from "../../../src/helpers/calculator";
import { consts } from "../../../src/localization";

const chance = new Chance();

describe("Helpers - Calculator", () => {
  test("Invalid group size", () => {
    const current_points = chance.natural({ max: 1e5 });
    const wanted_points = chance.natural({ max: 1e5 });
    const group_size = chance.bool() ? 1 : chance.natural({ min: 6 });

    expect(() => {
      pointsCalculator(current_points, wanted_points, { group_size });
    }).toThrowError(consts.invalidPlayerCount);
  });

  test("Current > Wanted", () => {
    const wanted_points = chance.natural({ max: 1e5 });
    const current_points = chance.natural({ min: wanted_points, max: 1e5 });
    const group_size = chance.natural({ min: 2, max: 5 });

    const results = pointsCalculator(current_points, wanted_points, { group_size });

    expect(results).toMatchObject({ games_count: 0, points_needed: 0 })
  });

  test("Wanted > Current", () => {
    const current_points = chance.natural({ max: 1e5 });
    const wanted_points = chance.natural({ min: current_points, max: 1e5 });
    const group_size = chance.natural({ min: 2, max: 5 });

    const results = pointsCalculator(current_points, wanted_points, { group_size });
    
    expect(results).toMatchObject({ games_count: expect.any(Number), points_needed: expect.any(Number) })
  });
});