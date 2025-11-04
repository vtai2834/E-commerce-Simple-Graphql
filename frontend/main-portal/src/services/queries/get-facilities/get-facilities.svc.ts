import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";

import { LIST_FACILITY_QUERY } from "./get-facilities.query";
import { IListFacilityInput, IListFacilityResponse } from "./get-facilities.type";

export class ListFacilityApi extends GraphqlCaller<
  IListFacilityResponse['facilitiesByIds'], // Parsed data type
  IListFacilityInput, // Input variables type
  IListFacilityResponse // Raw response type 
> {
  constructor(client: ApolloClient) {
    super(
      client,
      LIST_FACILITY_QUERY,
      (raw) => raw.facilitiesByIds,
    );
  }
}
