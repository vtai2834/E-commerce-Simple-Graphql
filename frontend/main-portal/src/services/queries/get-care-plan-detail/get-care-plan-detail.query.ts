import { gql } from "@apollo/client";

export const CARE_PLANS_DETAIL_QUERY = gql`
  query GetDetailCarePlanById($type: TypeHealthDataView, $filter: CarePlanHealthDataViewInput, $careplanId: ID!) {
    getDetailCarePlanById(type: $type, filter: $filter, careplanId: $careplanId) {
    createdAt
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
    friendlyId
    id
    note
    patient {
      carePlanId
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
      dailyInfo {
        date
        healthInfo {
          diastolic
          heartRate
          sleep
          sp02
          steps
          systolic
          weight
        }
        id
      }
    }
    start
    status
    stop
    updatedAt
  }
}`;