import { gql } from "@apollo/client";

export const EDIT_CAREPLAN_MUTATION = gql`
  mutation UpdateCarePlanPhysician($newPhysicianId: ID!, $carePlanFriendlyId: Int!) {
  updateCarePlanPhysician(newPhysicianId: $newPhysicianId, carePlanFriendlyId: $carePlanFriendlyId) {
    id
    note
    start
    status
    stop
    physician {
      id
      firstName
      lastName
      email
    }
  }
}
`;
