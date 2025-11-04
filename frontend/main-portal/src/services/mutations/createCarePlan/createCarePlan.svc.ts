import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { CREATE_CAREPLAN_MUTATION } from "./createCarePlan.mutation";
import { ICreateCarePlanInput, ICreateCarePlanResponse, IParseDataCreateCarePlan } from "./createCarePlan.type";
// import { EDIT_CAREPLAN_MUTATION } from "./editCarePlan.mutation";
// import { IEditCarePlanInput, IEditCarePlanResponse, IParseDataEditCarePlan } from "./editCarePlan.type";

export class CreateCarePlanApi extends GraphqlCaller<
  IParseDataCreateCarePlan,
  ICreateCarePlanInput,
  ICreateCarePlanResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      CREATE_CAREPLAN_MUTATION,
      (raw) => raw.createCarePlan,
      "mutation"
    );
  }
}
