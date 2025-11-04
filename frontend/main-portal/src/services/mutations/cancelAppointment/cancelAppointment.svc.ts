import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { ICancelAppointmentInput, ICancelAppointmentResponse, IParseDataCancelAppointment } from "./cancelAppointment.type";
import { CANCEL_APPOINTMENT_MUTATION } from "./cancelAppointment.mutation";

export class CancelAppointmentApi extends GraphqlCaller<
  IParseDataCancelAppointment,
  ICancelAppointmentInput,
  ICancelAppointmentResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      CANCEL_APPOINTMENT_MUTATION,
      (raw) => raw.cancelAppointment,
      "mutation"
    );
  }
}
