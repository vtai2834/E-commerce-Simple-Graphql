import { gql } from "@apollo/client";

export const CREATE_CAREPLAN_MUTATION = gql`
    mutation CreateCarePlan($input: CarePlanInput!) {
    createCarePlan(input: $input) {
        id
    }
    }
`;
