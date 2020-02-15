import { ISummonerResponse } from "./ISummoner";

export interface IInviteResponse {
  readonly id: number;
  readonly points: number;
  readonly sender: IInviteSenderResponse;
  readonly status: number;
  readonly club: number;
}

export interface IInviteSenderResponse extends ISummonerResponse {
  readonly rank: number;
  readonly level: number;
  readonly honor: boolean;
}
