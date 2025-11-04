import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { CREATE_APPOINTMENT_MUTATION } from "./createAppointment.mutation";
import { ICreateAppointmentInput, ICreateAppointmentResponse, IParseDataCreateAppointment } from "./createAppointment.type";

export class CreateAppointmentApi extends GraphqlCaller<
  IParseDataCreateAppointment,
  ICreateAppointmentInput,
  ICreateAppointmentResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      CREATE_APPOINTMENT_MUTATION,
      (raw) => raw.createAppointment,
      "mutation"
    );
  }
}
