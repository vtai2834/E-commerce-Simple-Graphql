import { gql } from "@apollo/client";

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($input: RefreshTokenInput!) {
  refreshToken(input: $input) {
    code
    accessToken
    isSuccess
    message
    refreshToken
  }
}
`;
