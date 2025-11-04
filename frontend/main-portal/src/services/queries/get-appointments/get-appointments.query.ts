import { gql } from "@apollo/client";

export const LIST_APPOINTMENTS_QUERY = gql`
query GetAppointments($physicianId: String!, $filter: AppointmentFilterInput) {
  getAppointments(physicianId: $physicianId, filter: $filter) {
    carePlanId
    duration
    facilityId
    id
    note
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
    physicianId
    startTime
    status
    stopTime
    title
    type
  }
}`
