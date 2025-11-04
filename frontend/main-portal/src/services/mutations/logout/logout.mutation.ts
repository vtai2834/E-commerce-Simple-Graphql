import { gql } from "@apollo/client";

export const LOGOUT_MUTATION = gql`
  mutation Logout($input: LogoutInput!) {
  logout(input: $input) {
    code
    message
  }
}
`;
