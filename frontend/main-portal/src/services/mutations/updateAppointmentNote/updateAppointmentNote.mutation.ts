import { gql } from "@apollo/client";

export const UPDATE_APPOINTMENT_NOTE_MUTATION = gql`
    mutation UpdateAppointmentNote($appointmentId: ID!, $note: String!) {
        updateAppointmentNote(appointmentId: $appointmentId, note: $note) {
            appointmentId
            isSuccess
        }
    }
`;


