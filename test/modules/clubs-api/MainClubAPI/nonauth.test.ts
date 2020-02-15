import { Chance } from "chance";

import { mocks } from "../../../__mocks__/MainClubAPI.mock";

import { MainClubAPI } from "../../../../src/clubs-api/components/MainClubAPI";
import { ISortedRequest, IPagedRequest } from "../../../../src/clubs-api/interfaces/IApiCaller";
import { ClubsAPIInvoker } from "../../../../src/clubs-api/helpers/api-invoker";

import { consts } from "../../../../src/localization";

const chance = new Chance();

describe("ClubsAPI - Main API [non-auth]", () => {
  const club_id = chance.natural({ max: 1e6 });
  const paged = { page: 1, per_page: 10 };

  const api = new ClubsAPIInvoker();
  const mainAPI = new MainClubAPI(api);

  test("getIncomingRequests", async () => {
    const params: ISortedRequest & IPagedRequest = { ...paged, ordering: "-id" }

    const req = mocks.getIncomingRequests().query({ ...params, club: club_id }).reply(403);

    const mainReq = mainAPI.getIncomingRequests(club_id, params);

    await expect(mainReq).rejects.toThrow(consts.authError);
    expect(req.isDone()).toBeTruthy();
  })
});