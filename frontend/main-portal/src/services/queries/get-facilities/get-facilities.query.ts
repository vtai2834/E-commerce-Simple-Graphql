import { gql } from "@apollo/client";

export const LIST_FACILITY_QUERY = gql`
  query FacilitiesByIds($ids: [ID!]!) {
  facilitiesByIds(ids: $ids) {
    id
    name
    status
    contactInfo {
      address
    }
  }
}
`;