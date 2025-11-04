import { gql } from '@apollo/client';

export const DETAIL_REPORTS_QUERY = gql`
  query GetReportDetail($reportId: ID!) {
    getReportDetail(reportId: $reportId) {
      patient {
        dob
        email
        firstName
        id
        lastName
      }
      physician {
        id
        firstName
        lastName
      }
      report {
        fromDate
        id
        note
        reportUrl
        toDate
        status
      }
    }
  }
`;
