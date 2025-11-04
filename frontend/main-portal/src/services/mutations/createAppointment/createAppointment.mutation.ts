import { gql } from "@apollo/client";

export const CREATE_APPOINTMENT_MUTATION = gql`
    mutation CreateAppointment($input: CreateAppointmentInput!) {
        createAppointment(input: $input) {
            id
            type
            status
            patientId
            physicianId
            facilityId
            note
            startTime
            stopTime
            duration
            carePlanId
            title
            createdAt
            updatedAt
        }
    }
`;
