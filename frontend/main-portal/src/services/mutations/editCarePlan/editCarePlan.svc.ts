import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { EDIT_CAREPLAN_MUTATION } from "./editCarePlan.mutation";
import { IEditCarePlanInput, IEditCarePlanResponse, IParseDataEditCarePlan } from "./editCarePlan.type";

export class EditCarePlanApi extends GraphqlCaller<
  IParseDataEditCarePlan,
  IEditCarePlanInput,
  IEditCarePlanResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      EDIT_CAREPLAN_MUTATION,
      (raw) => raw.updateCarePlanPhysician,
      "mutation"
    );
  }
}
