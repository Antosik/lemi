import { MainClubAPI } from "../../../src/clubs-api/components/MainClubAPI";
import { ISortedRequest, IPagedRequest } from "../../../src/clubs-api/interfaces/IApiCaller";
import { ClubsAPIInvoker } from "../../../src/clubs-api/helpers/api-invoker";

import { consts } from "../../../src/localization";

import { mocks } from "../../__mocks__/MainClubAPI.mock";

describe("ClubsAPI - Main API", () => {
  const season_id = 29;
  const club_id = 10875;
  const paged = { page: 1, per_page: 10 };

  describe("without token", () => {
    const api = new ClubsAPIInvoker();
    const mainAPI = new MainClubAPI(api);
    
    test("getSeasons", async () => {
      const req = mocks.getSeasons().reply(200, []);

      const mainReq = mainAPI.getSeasons();

      await expect(mainReq).resolves.toBeDefined(); // ToDo: Pass data
      expect(req.isDone()).toBeTruthy();
    })
    
    test("getSeason", async () => {
      const req = mocks.getSeason(season_id).reply(200, {});

      const mainReq = mainAPI.getSeason(season_id);

      await expect(mainReq).resolves.toBeDefined(); // ToDo: Pass data
      expect(req.isDone()).toBeTruthy();
    })
    
    test("getLiveSeason", async () => {
      mocks.getSeasons().reply(200, []);

      const mainReq = mainAPI.getLiveSeason();

      await expect(mainReq).resolves.toBeUndefined(); // ToDo: Pass data
    })
    
    test("getIncomingRequests", async () => {
      const params: ISortedRequest & IPagedRequest = { ...paged, ordering: "-id" }

      const req = mocks.getIncomingRequests().query({ ...params, club: club_id }).reply(403);

      const mainReq = mainAPI.getIncomingRequests(club_id, params);

      await expect(mainReq).rejects.toThrow(consts.authError);
      expect(req.isDone()).toBeTruthy();
    })
  });
});