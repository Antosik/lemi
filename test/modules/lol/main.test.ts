import * as dotenv from "dotenv";

import ClubsAPI from "../../../src/lol";

dotenv.config();

describe("Clubs API: main tests", () => {
  test("init tests", () => {
    const api = new ClubsAPI();

    expect.assertions(2);
    expect(api).toBeDefined();
    expect(api).toBeInstanceOf(ClubsAPI);
  });
});
