import { gql } from "@apollo/client";

export const LIST_REPORTS_QUERY = gql`
  query GetListReports($filter: ReportFilterInput) {
    getListReports(filter: $filter) {
      pagination {
        limit
        page
        total
        totalPages
      }
      reports {
        carePlanId
        fromDate
        id
        reportUrl
        note
        toDate
        status
      }
    }
  }
  `
