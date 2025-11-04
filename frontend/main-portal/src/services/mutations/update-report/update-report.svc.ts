import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { IUpdateReportInput, IUpdateReportResponse } from "./update-report.type";
import { UPDATE_REPORT_MUTATION } from "./update-report.mutation";

export class UpdateReportApi extends GraphqlCaller<
  IUpdateReportResponse['updateReport'],
  IUpdateReportInput,
  IUpdateReportResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      UPDATE_REPORT_MUTATION,
      (raw) => raw.updateReport,
      "mutation"
    );
  }
}
