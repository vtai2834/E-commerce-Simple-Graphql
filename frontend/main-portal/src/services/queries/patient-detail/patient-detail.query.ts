import { gql } from "@apollo/client";

export const PATIENT_DETAIL_QUERY = gql`
  query GetPatientDetails($friendlyId: String, $email: String, $getPatientDetailsId: ID) {
    getPatientDetails(friendlyId: $friendlyId, email: $email, id: $getPatientDetailsId) {
      patient {
        carePlanId
        contactInfo {
          address
          city
          country
          phone
          state
        }
        dob
        email
        firstName
        id
        lastName
      }
      carePlan {
        note
      }
    }
}
`;
