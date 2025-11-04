import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { CREATE_REPORT_MUTATION } from "./create-report.mutation";
import { ICreateReportInput, ICreateReportResponse } from "./create-report.type";

export class CreateReportApi extends GraphqlCaller<
  ICreateReportResponse['createReportPdf'],
  ICreateReportInput,
  ICreateReportResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      CREATE_REPORT_MUTATION,
      (raw) => raw.createReportPdf,
      "mutation"
    );
  }
}
