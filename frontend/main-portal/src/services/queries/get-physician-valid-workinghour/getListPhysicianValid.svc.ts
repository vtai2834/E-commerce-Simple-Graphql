import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { IGetPhysiciansValidInput, IGetPhysiciansValidResponse, IParseDataGetPhysiciansValid } from "./getListPhysicianValid.type";
import { GET_PHYSICIANS_VALID_WORKING_HOUR_QUERY } from "./getListPhysicianValid.query";


export class GetPhysiciansValidApi extends GraphqlCaller<
  IParseDataGetPhysiciansValid,
  IGetPhysiciansValidInput,
  IGetPhysiciansValidResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      GET_PHYSICIANS_VALID_WORKING_HOUR_QUERY,
      (raw) => raw.getListPhysicianValid,
      "query"
    );
  }
}
