import { Chance } from "chance";

import { generateCalcseasonText } from "../../../src/commands/calcseason/text";

const chance = new Chance();

describe("Commands - CalcSeason", () => {
  test("Text generation", () => {
    const wanted = chance.natural({ max: 50 });
    const points_needed = chance.natural({ max: 1e5 });
    const games_count = chance.natural({ max: 1e5 });
    const group_size = chance.natural({ max: 5 });

    const text = generateCalcseasonText({ wanted, points_needed, games_count, group_size });

    expect(typeof text).toStrictEqual("string");
    expect(text).toContain(`желаемого ${wanted} места`);
    expect(text).toContain(`заработать ${points_needed}`);
    expect(text).toContain(`выиграв **${games_count}`);
    expect(text).toContain(`составом из ${group_size}`);
  })
});