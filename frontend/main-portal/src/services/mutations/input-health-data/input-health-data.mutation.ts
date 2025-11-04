import { gql } from "@apollo/client";

export const INPUT_HEALTH_DATA_MUTATION = gql`mutation($patientId: ID!, $date: String!, $healthInfo: HealthInput!) {
  inputDailyInfo(patientId: $patientId, date: $date, healthInfo: $healthInfo) {
    code
    message
  }
}
`;
