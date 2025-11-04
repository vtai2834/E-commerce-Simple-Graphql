import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { LOGIN_PHYSICIAN_MUTATION } from "./physicianLogin.mutation";
import { IPhysicianLoginInput, IPhysicianLoginResponse, IParseDataPhysicianLogin } from "./physicianLogin.type";

export class PhysicianLoginApi extends GraphqlCaller<
  IParseDataPhysicianLogin,
  { input: IPhysicianLoginInput },
  IPhysicianLoginResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      LOGIN_PHYSICIAN_MUTATION,
      (raw) => raw.loginPhysician,
      "mutation"
    );
  }
}
