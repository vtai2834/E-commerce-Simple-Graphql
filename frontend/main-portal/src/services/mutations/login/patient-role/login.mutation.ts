import { gql } from "@apollo/client";

export const LOGIN_PATIENT_MUTATION = gql`
  mutation LoginPatient($input: LoginInput!) {
    loginPatient(input: $input) {
      isSuccess
      code
      message
      accessToken
      refreshToken
      user {
        dob
        email
        firstName
        id
        lastName
      }
    }
  }
`;
