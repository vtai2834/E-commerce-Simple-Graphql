import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { REFRESH_TOKEN_MUTATION } from "./refreshToken.mutation";
import { IParseDataRefreshToken, IRefreshTokenResponse, IRefreshTokenGraphqlVariables } from "./refreshToken.type";

export class RefreshTokenApi extends GraphqlCaller<
  IParseDataRefreshToken,
  IRefreshTokenGraphqlVariables, // Sử dụng kiểu biến GraphQL mới ở đây
  IRefreshTokenResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      REFRESH_TOKEN_MUTATION,
      (raw) => raw.refreshToken,
      "mutation"
    );
  }
}
