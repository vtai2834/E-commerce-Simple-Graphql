import { gql } from "@apollo/client";

export const STOP_CAREPLAN_MUTATION = gql`
    mutation StopCarePlan($carePlanFriendlyId: Int!) {
        stopCarePlan(carePlanFriendlyId: $carePlanFriendlyId) {
            id
        }
    }
`;
