import { Chance } from "chance";

import { mocks } from "../../../__mocks__/MainClubAPI.mock";
import { mockPagedResponse } from "../../../__mocks__/responses/IApiCaller";
import { mockInviteResponse } from "../../../__mocks__/responses/IInvite";
import { mockMultiple } from "../../../__mocks__/responses/helpers";

import { MainClubAPI } from "../../../../src/clubs-api/components/MainClubAPI";
import { ISortedRequest, IPagedRequest } from "../../../../src/clubs-api/interfaces/IApiCaller";
import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

const chance = new Chance();

describe("ClubsAPI - Main API [auth]", () => {
  const club_id = chance.natural({ max: 1e6 });
  const paged = { page: 1, per_page: 10 };

  const api = new ClubsAPIInvoker();
  const mainAPI = new MainClubAPI(api);

  test("getIncomingRequests", async () => {
    const params: ISortedRequest & IPagedRequest = { ...paged, ordering: "-id" }
    const invites = mockMultiple(() => mockInviteResponse({ club_id }));

    const req = mocks.getIncomingRequests().query({ ...params, club: club_id })
    .reply(200, mockPagedResponse(invites, paged));

    const mainReq = mainAPI.getIncomingRequests(club_id, params);

    await expect(mainReq).resolves.toBeDefined();
    expect(req.isDone()).toBeTruthy();
  })
});