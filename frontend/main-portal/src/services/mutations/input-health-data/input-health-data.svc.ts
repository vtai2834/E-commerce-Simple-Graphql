import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { INPUT_HEALTH_DATA_MUTATION } from "./input-health-data.mutation";
import { IInputHealthDataInput, IInputHealthDataResponse } from "./input-health-data.type";

export class InputHealthDataApi extends GraphqlCaller<
  IInputHealthDataResponse['inputDailyInfo'],
  IInputHealthDataInput,
  IInputHealthDataResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      INPUT_HEALTH_DATA_MUTATION,
      (raw) => raw.inputDailyInfo,
      "mutation"
    );
  }
}
