import { Chance } from "chance";

import { ISummonerResponse } from "../../../src/clubs-api/interfaces/ISummoner";

const chance = new Chance();

export const mockSummonerResponse = (): ISummonerResponse => ({
  id: chance.natural({ max: 1e6 }),
  avatar: chance.url(),
  lol_account_id: chance.natural({ max: 1e6 }),
  summoner_name: chance.name(),
  current_club: chance.natural({ max: 1e6 })
});