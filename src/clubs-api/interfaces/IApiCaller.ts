import { ClubsAPIInvoker } from "../helpers/api-invoker";

export type TSeasonClubIdentifier = "current" | number;
export type TStageClubIdentifier = "me" | number;

export interface ISortedRequest {
  ordering: "id" | "-id";
}

export interface IPagedRequest {
  per_page?: number;
  page?: number;
}

export interface IPagedResponse<T> {
  readonly count: number;
  readonly next?: string;
  readonly previous?: string;
  readonly results: T[];
}

export interface IApiCaller {
  readonly api: ClubsAPIInvoker;
}