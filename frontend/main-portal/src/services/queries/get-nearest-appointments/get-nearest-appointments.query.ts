import { gql } from "@apollo/client";

export const GET_NEAREST_APPOINTMENT_QUERY = gql`
  query GetNearestAppointment($patientId: String!) {
    getNearestAppointment(patientId: $patientId) {
      id
      type
      status
      patient {
        id
        firstName
        lastName
        dob
        contactInfo {
          address
          city
          country
          phone
          state
        }
      }
      physician {
        firstName
        lastName
      }
      facility {
        name
      }
      physicianId
      facilityId
      note
      startTime
      stopTime
      duration
      carePlanId
      title
    }
  }
`;
