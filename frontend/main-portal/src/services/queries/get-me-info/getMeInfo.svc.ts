import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";

import { GET_ME_INFO_QUERY } from "./getMeInfo.query";
import { IGetMeInfoResponse, IParseDataGetMeInfo } from "./getMeInfo.type";

export class GetMeInfoApi extends GraphqlCaller<
  IParseDataGetMeInfo,
  undefined,
  IGetMeInfoResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      GET_ME_INFO_QUERY,
      (raw) => raw.getMeInfo,
      "query"
    );
  }
}
