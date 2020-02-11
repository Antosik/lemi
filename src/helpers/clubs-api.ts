// tslint:disable no-var-requires

import axios, { AxiosPromise } from "axios";
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from "axios-extensions";
import { ICacheLike } from "axios-extensions/lib/cacheAdapterEnhancer";
const LRUCache = require("lru-cache");
const axiosHttpAdapter = require("axios/lib/adapters/http");

import { consts } from "../localization";

function createClubsAPIAxiosInstance(endpoint) {
  const cache = new LRUCache({
    max: 100,
    maxAge: 60e3 * 5
  }) as ICacheLike<AxiosPromise<any>>;

  const adapter = throttleAdapterEnhancer(
    cacheAdapterEnhancer(
      axiosHttpAdapter, { enabledByDefault: true, cacheFlag: "useCache", defaultCache: cache }
    ),
    { threshold: 2 * 1000 }
  );

  return axios.create({
    baseURL: endpoint,
    headers: { "Cache-Control": "no-cache" },
    adapter
  });
}

export class ClubsAPICaller {
  public static v1Axios = createClubsAPIAxiosInstance("https://clubs.lcu.ru.leagueoflegends.com/api");
  public static v2Axios = createClubsAPIAxiosInstance("https://clubs.lcu.ru.leagueoflegends.com/api-v2");

  protected _token: string;

  constructor(token?: string) {
    this._token = token;
  }

  protected query(query: string, { data = {}, params = {} } = { data: {}, params: {} }, version = 1): Promise<any> {
    const apiCaller = version === 1 ? ClubsAPICaller.v1Axios : ClubsAPICaller.v2Axios;
    const Cookie = this.getAuthCookie();

    return apiCaller(`/${query}/`, { params, data, headers: { Cookie } })
      .then(({ data: result }) => result)
      .catch((e) => {
        if (e.response && e.response.data && e.response.data.detail && e.response.data.detail === "club not selected") {
          throw new Error(consts.clubNotSelected);
        }
        if (e.response && e.response.status === 401) {
          throw new Error(consts.authError);
        }
        throw new Error(consts.requestError);
      });
  }

  protected getAuthCookie() {
    return this._token ? `PVPNET_TOKEN_RU=${this._token}` : "";
  }
}