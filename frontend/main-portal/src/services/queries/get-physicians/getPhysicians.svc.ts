import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";

import { GET_PHYSICIANS_QUERY } from "./getPhysicians.query";
import { IGetPhysiciansInput, IGetPhysiciansResponse, IParseDataGetPhysicians } from "./getPhysicians.type";

export class GetPhysiciansApi extends GraphqlCaller<
  IParseDataGetPhysicians['physicians'],
  IGetPhysiciansInput,
  IGetPhysiciansResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      GET_PHYSICIANS_QUERY,
      (raw) => raw.physiciansList.physicians,
      "query"
    );
  }
}
