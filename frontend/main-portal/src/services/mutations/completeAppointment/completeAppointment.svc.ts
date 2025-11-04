import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { ICompleteAppointmentInput, ICompleteAppointmentResponse, IParseDataCompleteAppointment } from "./completeAppointment.type";
import { COMPLETE_APPOINTMENT_MUTATION } from "./completeAppointment.mutation";


export class CompleteAppointmentApi extends GraphqlCaller<
  IParseDataCompleteAppointment,
  ICompleteAppointmentInput,
  ICompleteAppointmentResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      COMPLETE_APPOINTMENT_MUTATION,
      (raw) => raw.completeAppointment,
      "mutation"
    );
  }
}
