import { gql } from "@apollo/client";

export const LOGIN_PHYSICIAN_MUTATION = gql`
  mutation LoginPhysician($input: LoginInput!) {
    loginPhysician(input: $input) {
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
        facilities
      }
    }
  }
`;
