import * as dotenv from "dotenv";

import Lemi from "../../src/bot";


describe("lemi tests", function () {
  describe("init tests", () => {
    it("incorrect init", () => {
      expect.assertions(1);

      expect(() => {
        new Lemi({ discord_token: "", prefix: "", lol_token: "" });
      }).toThrow("No discord token passed!");
    });

    it("correct init", async () => {
      expect.assertions(1);

      dotenv.config();

      const lemi = new Lemi({
        lol_token: process.env.LOL_TOKEN || "test",
        discord_token: process.env.DISCORD_TOKEN || "test",
        prefix: process.env.LEMI_PREFIX || "test"
      });
      const token = await lemi.run();

      expect(token).toStrictEqual(process.env.DISCORD_TOKEN);

      await lemi.stop();
    });
  });
});
