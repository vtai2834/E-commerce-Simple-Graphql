import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { IGetListReportsInput, IGetListReportsResponse } from "./get-reports.type";
import { LIST_REPORTS_QUERY } from "./get-reports.query";

export class ListReportsApi extends GraphqlCaller<
  IGetListReportsResponse['getListReports'],
  IGetListReportsInput,
  IGetListReportsResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      LIST_REPORTS_QUERY,
      (raw) => {
        return raw.getListReports;
      }
    );
  }
}
