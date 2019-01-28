import * as dotenv from "dotenv";
import Lemi from "../../src/bot";

dotenv.config();

describe("Lemi tests", () => {
  describe("init tests", () => {
    test("incorrect init", (done) => {
      function incorrectInit() {
        const lemi = new Lemi({ discord_token: "", prefix: "", lol_token: "" });
        lemi.run();
      }

      expect.assertions(1);
      expect(incorrectInit).toThrow();

      done();
    });

    test("correct init", async (done) => {
      const lemi = new Lemi({
        lol_token: process.env.LOL_TOKEN,
        discord_token: process.env.DISCORD_TOKEN,
        prefix: process.env.LEMI_PREFIX
      });
      const token = await lemi.run();

      expect.assertions(1);
      expect(token).toEqual(process.env.DISCORD_TOKEN);

      await lemi.stop();

      done();
    });
  });
});
