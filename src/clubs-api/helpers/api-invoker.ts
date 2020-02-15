import { createClubsAPIAxiosInstance } from "./axios";
import { consts } from "../../localization";

export class ClubsAPIInvoker {
  private static v1Axios = createClubsAPIAxiosInstance("https://clubs.lcu.ru.leagueoflegends.com/api");
  private static v2Axios = createClubsAPIAxiosInstance("https://clubs.lcu.ru.leagueoflegends.com/api-v2");

  private _token: string;

  constructor(token: string = "") {
    this._token = token;
  }

  public query(query: string, { data = {}, params = {} } = { data: {}, params: {} }, version = 1): Promise<unknown> {
    const apiCaller = version === 1 ? ClubsAPIInvoker.v1Axios : ClubsAPIInvoker.v2Axios;
    const Cookie = this.getAuthCookie();

    console.log(query, params, version);

    return apiCaller(`/${query}/`, { params, data, headers: { Cookie } })
      .then(({ data: result }) => result)
      .catch((e) => {
        // console.log(e);
        if (e.response?.data?.detail === "club not selected") {
          throw new Error(consts.clubNotSelected);
        }
        if (e.response?.status === 401 || e.response?.status === 403) {
          throw new Error(consts.authError);
        }
        throw new Error(consts.requestError);
      });
  }

  private getAuthCookie(): string {
    return this._token ? `PVPNET_TOKEN_RU=${this._token}` : "";
  }
}

