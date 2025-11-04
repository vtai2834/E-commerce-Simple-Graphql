import { gql } from '@apollo/client';

export const RE_GENERATE_REPORT_MUTATION = gql`
  mutation ReGenerateReport($reportId: ID!) {
    reGenerateReport(reportId: $reportId) {
      reportUrl
    }
  }
`;
