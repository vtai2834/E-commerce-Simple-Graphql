import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { LOGOUT_MUTATION } from "./logout.mutation";
import { ILogoutGraphqlVariables, ILogoutResponse, IParseDataLogout } from "./logout.type";

export class LogoutApi extends GraphqlCaller<
  IParseDataLogout,
  ILogoutGraphqlVariables, 
  ILogoutResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      LOGOUT_MUTATION,
      (raw) => raw.logout,
      "mutation"
    );
  }
}
