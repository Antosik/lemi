import { IPagedRequest, IPagedResponse } from "../../../src/clubs-api/interfaces/IApiCaller";

export function mockPagedResponse<T>(results: T[], params: IPagedRequest = {}): IPagedResponse<T> {
  return {
    count: params.per_page || 30,
    next: "",
    previous: "",
    results
  }
}