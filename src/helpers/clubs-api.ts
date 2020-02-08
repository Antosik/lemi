// tslint:disable no-var-requires

import axios, { AxiosPromise } from "axios";
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from "axios-extensions";
import { ICacheLike } from "axios-extensions/lib/cacheAdapterEnhancer";
const LRUCache = require("lru-cache");
const axiosHttpAdapter = require("axios/lib/adapters/http");

function createClubsAPIAxiosInstance() {
  const endpoint = "https://clubs.lcu.ru.leagueoflegends.com/api";

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

export default createClubsAPIAxiosInstance();
