import { gql } from "@apollo/client";

export const GET_ME_INFO_QUERY = gql`
  query GetMeInfo {
    getMeInfo {
      code
      accessToken
      refreshToken
      user {
        dob
        email
        firstName
        id
        lastName
        role
        facilities
      }
    }
  }
`;
