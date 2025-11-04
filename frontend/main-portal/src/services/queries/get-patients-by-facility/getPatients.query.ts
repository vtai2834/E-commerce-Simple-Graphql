import { gql } from "@apollo/client";

export const GET_PATIENTS_QUERY = gql`
  query GetListPatients($input: GetListPatientsInput!) {
    getListPatients(input: $input) {
      data {
        id
        firstName
        lastName
        email
        carePlanId
        dob
        contactInfo {
          phone
        }
      }
    }
  }
`;
