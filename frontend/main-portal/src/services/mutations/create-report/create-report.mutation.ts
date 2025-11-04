import { gql } from "@apollo/client";

export const CREATE_REPORT_MUTATION = gql`
    mutation CreateReportPdf($input: CreateReportInput!) {
        createReportPdf(input: $input) {
            override
            report {
                carePlanId
                fromDate
                id
                note
                reportUrl
                toDate
            }
        }
    }
`;
