import { gql } from "@apollo/client";

export const LIST_CARE_PLANS_QUERY = gql`
query GetListCarePlans($filter: CarePlanFilterInput) {
   getListCarePlans(filter: $filter) {
      data {
        id
        friendlyId
        facility {
          contactInfo {
            address
            city
            country
            phone
            state
          }
          id
          name
          status
        }
        note
        patient {
          contactInfo {
            address
            city
            country
            phone
            state
          }
          dob
          email
          firstName
          id
          lastName
        }
        physician {
          id
          firstName
          email
          dob
          lastName
          status
          workingTime {
            fri {
              from {
                m
                h
              }
              to {
                h
                m
              }
            }
            mon {
              from {
                h
                m
              }
              to {
                h
                m
              }
            }
          }
          contactInfo {
            address
            city
            country
            phone
            state
          }
        }
        start
        status
        stop
      }
      pagination {
        limit
        page
        total
        totalPages
      }
    }
  }
`;