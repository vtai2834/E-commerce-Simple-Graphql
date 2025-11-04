import { gql } from "@apollo/client";

export const COMPLETE_APPOINTMENT_MUTATION = gql`
    mutation CompleteAppointment($appointmentId: ID!) {
        completeAppointment(appointmentId: $appointmentId) {
            appointmentId
            isSuccess
        }
    }
`;
