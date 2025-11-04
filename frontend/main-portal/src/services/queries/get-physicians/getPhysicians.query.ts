import { gql } from "@apollo/client";

export const GET_PHYSICIANS_QUERY = gql`
  query PhysiciansList($facilityId: String) {
    physiciansList(facilityId: $facilityId) {
      physicians {
        id
        firstName
        lastName
      }
    }
  }
`;
