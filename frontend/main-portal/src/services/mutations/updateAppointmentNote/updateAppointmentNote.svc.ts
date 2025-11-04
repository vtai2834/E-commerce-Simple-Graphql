import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { IParseDataUpdateAppointmentNote, IUpdateAppointmentNoteInput, IUpdateAppointmentNoteResponse } from "./updateAppointmentNote.type";
import { UPDATE_APPOINTMENT_NOTE_MUTATION } from "./updateAppointmentNote.mutation";

export class UpdateAppointmentNoteApi extends GraphqlCaller<
  IParseDataUpdateAppointmentNote,
  IUpdateAppointmentNoteInput,
  IUpdateAppointmentNoteResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      UPDATE_APPOINTMENT_NOTE_MUTATION,
      (raw) => raw.updateAppointmentNote,
      "mutation"
    );
  }
}


