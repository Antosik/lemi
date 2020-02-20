import { Chance } from "chance";

import { IInviteResponse, IInviteSenderResponse } from "../../../src/clubs-api/interfaces/IInvite";

import { mockSummonerResponse } from "./ISummoner.mock";

const chance = new Chance();

export const mockInviteSenderResponse = (): IInviteSenderResponse => ({
  ...mockSummonerResponse(),
  rank: chance.natural({ max: 5 }),
  level: chance.natural({ max: 1e3 }),
  honor: chance.bool()
});

export const mockInviteResponse = ({ club_id }: { club_id: number }): IInviteResponse => ({
  id: chance.natural({ max: 1e5 }),
  club: club_id,
  points: chance.natural({ max: 1e5 }),
  status: chance.natural({ max: 5 }),
  sender: mockInviteSenderResponse()
});