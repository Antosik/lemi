import { Chance } from "chance";

import { mocks } from "../../../mocks/MainClubAPI.mock";
import { mockPagedResponse } from "../../../mocks/responses/IApiCaller";
import { mockInviteResponse } from "../../../mocks/responses/IInvite";
import { mockMultiple } from "../../../mocks/responses/helpers";

import { MainClubAPI } from "../../../../src/clubs-api/components/MainClubAPI";
import { ISortedRequest, IPagedRequest } from "../../../../src/clubs-api/interfaces/IApiCaller";
import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

const chance = new Chance();

describe("clubsAPI - Main API [auth]", () => {
  const club_id = chance.natural({ max: 1e6 });
  const paged = { page: 1, per_page: 10 };

  const api = new ClubsAPIInvoker();
  const mainAPI = new MainClubAPI(api);

  it("getIncomingRequests", async () => {
    expect.assertions(2);

    const params: ISortedRequest & IPagedRequest = { ...paged, ordering: "-id" };
    const invites = mockMultiple(() => mockInviteResponse({ club_id }));

    const req = mocks.getIncomingRequests().query({ ...params, club: club_id })
      .reply(200, mockPagedResponse(invites, paged));

    const mainReq = mainAPI.getIncomingRequests(club_id, params);

    expect(await mainReq).toBeDefined();
    expect(req.isDone()).toStrictEqual(true);
  });
});