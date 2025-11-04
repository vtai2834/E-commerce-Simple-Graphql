import { gql } from "@apollo/client";

export const GET_PHYSICIANS_VALID_WORKING_HOUR_QUERY = gql`
    query GetListPhysicianValid($input: GetPhysicianValidInput!) {
        getListPhysicianValid(input: $input) {
            data {
            id
            email
            firstName
            lastName
            fullName
            phone
            }
        }
    }
`;
