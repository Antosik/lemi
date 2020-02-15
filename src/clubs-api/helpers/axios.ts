import axios, { AxiosPromise, AxiosInstance } from "axios";
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from "axios-extensions";
import { ICacheLike } from "axios-extensions/lib/cacheAdapterEnhancer";

import LRUCache = require("lru-cache");
// @ts-ignore
import axiosHttpAdapter = require("axios/lib/adapters/http");

export function createClubsAPIAxiosInstance(endpoint: string): AxiosInstance {
  const cache = new LRUCache({
    max: 100,
    maxAge: 60e3 * 5
  }) as ICacheLike<AxiosPromise<unknown>>;

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