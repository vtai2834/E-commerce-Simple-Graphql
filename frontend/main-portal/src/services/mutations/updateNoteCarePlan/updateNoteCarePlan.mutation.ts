import { gql } from "@apollo/client";

export const UPDATE_NOTE_CAREPLAN_MUTATION = gql`
  mutation UpdateCarePlanNote($carePlanFriendlyId: Int!, $newNote: String!) {
    updateCarePlanNote(carePlanFriendlyId: $carePlanFriendlyId, newNote: $newNote) {
      carePlanId
      isSuccess
    }
  }
`;


