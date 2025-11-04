import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { RE_GENERATE_REPORT_MUTATION } from "./re-generate-report.mutation";
import { IReGenerateReportInput, IReGenerateReportResponse } from "./re-generate-report.type";

export class ReGenerateReportApi extends GraphqlCaller<
  IReGenerateReportResponse['reGenerateReport'],
  IReGenerateReportInput,
  IReGenerateReportResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      RE_GENERATE_REPORT_MUTATION,
      (raw) => raw.reGenerateReport,
      "mutation"
    );
  }
}
