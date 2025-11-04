import { gql } from "@apollo/client";

export const CANCEL_APPOINTMENT_MUTATION = gql`
    mutation CancelAppointment($appointmentId: ID!) {
        cancelAppointment(appointmentId: $appointmentId) {
            appointmentId
            isSuccess
        }
    }
`;
