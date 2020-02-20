import { Chance } from "chance";

import { pointsCalculator } from "../../../src/helpers/calculator";
import { consts } from "../../../src/localization";

const chance = new Chance();

describe("helpers - Calculator", () => {
  it("invalid group size", () => {
    expect.assertions(1);

    const current_points = chance.natural({ max: 1e5 });
    const wanted_points = chance.natural({ max: 1e5 });
    const group_size = chance.natural({ min: 6 });

    expect(() => {
      pointsCalculator(current_points, wanted_points, { group_size });
    }).toThrow(consts.invalidPlayerCount);
  });

  it("current > Wanted", () => {
    expect.assertions(1);

    const wanted_points = chance.natural({ max: 1e5 });
    const current_points = chance.natural({ min: wanted_points, max: 1e5 });
    const group_size = chance.natural({ min: 2, max: 5 });

    const results = pointsCalculator(current_points, wanted_points, { group_size });

    expect(results).toMatchObject({ games_count: 0, points_needed: 0 });
  });

  it("wanted > Current", () => {
    expect.assertions(1);

    const current_points = chance.natural({ max: 1e5 });
    const wanted_points = chance.natural({ min: current_points, max: 1e5 });
    const group_size = chance.natural({ min: 2, max: 5 });

    const results = pointsCalculator(current_points, wanted_points, { group_size });

    expect(results).toMatchObject({ games_count: expect.any(Number), points_needed: expect.any(Number) });
  });
});