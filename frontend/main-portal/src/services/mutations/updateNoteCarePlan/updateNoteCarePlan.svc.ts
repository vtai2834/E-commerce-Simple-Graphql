import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { UPDATE_NOTE_CAREPLAN_MUTATION } from "./updateNoteCarePlan.mutation";
import { IUpdateNoteCarePlanInput, IUpdateNoteCarePlanParsed, IUpdateNoteCarePlanResponse } from "./updateNoteCarePlan.type";

export class UpdateNoteCarePlanApi extends GraphqlCaller<
  IUpdateNoteCarePlanParsed,
  IUpdateNoteCarePlanInput,
  IUpdateNoteCarePlanResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      UPDATE_NOTE_CAREPLAN_MUTATION,
      (raw) => raw.updateCarePlanNote,
      "mutation"
    );
  }
}


