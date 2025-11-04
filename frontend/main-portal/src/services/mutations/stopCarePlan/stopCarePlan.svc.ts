import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { STOP_CAREPLAN_MUTATION } from "./stopCarePlan.mutation";
import { IParseDataStopCarePlan, IStopCarePlanInput, IStopCarePlanResponse } from "./stopCarePlan.type";

export class StopCarePlanApi extends GraphqlCaller<
  IParseDataStopCarePlan,
  IStopCarePlanInput,
  IStopCarePlanResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      STOP_CAREPLAN_MUTATION,
      (raw) => raw.stopCarePlan,
      "mutation"
    );
  }
}