import { Chance } from "chance";

import { generateCalcStageNotPart, generateCalcStagePart } from "../../../src/commands/calcstage/text";

const chance = new Chance();

describe("Commands - CalcStage", () => {
  describe("Text generation", () => {
    test("Not participating", () => {
      const points_needed = chance.natural({ max: 1e5 });
      const games_count = chance.natural({ max: 1e5 });
      const group_size = chance.natural({ max: 5 });

      const text = generateCalcStageNotPart({ points_needed, games_count, group_size });

      expect(typeof text).toStrictEqual("string");
      expect(text).toContain("Ваш клуб не участвует в этапе");
      expect(text).toContain(`заработать ${points_needed}`);
      expect(text).toContain(`выиграв **${games_count}`);
      expect(text).toContain(`составом из ${group_size}`);
    });

    test("Participating", () => {
      const wanted_place = chance.natural({ max: 50 });
      const points_needed = chance.natural({ max: 1e5 });
      const games_count = chance.natural({ max: 1e5 });
      const group_size = chance.natural({ max: 5 });

      const text = generateCalcStagePart({ wanted_place, points_needed, games_count, group_size });

      expect(typeof text).toStrictEqual("string");
      expect(text).toContain(`желаемого ${wanted_place} места`);
      expect(text).toContain(`заработать ${points_needed}`);
      expect(text).toContain(`выиграв **${games_count}`);
      expect(text).toContain(`составом из ${group_size}`);
    });
  })
});