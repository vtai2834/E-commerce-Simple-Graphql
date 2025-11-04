import { gql } from "@apollo/client";

export const UPDATE_REPORT_MUTATION = gql`
   mutation updateReport($reportId: ID!, $input: UpdateReportInput!) {
      updateReport(reportId: $reportId, input: $input) {
        note
      }
   }
`;
