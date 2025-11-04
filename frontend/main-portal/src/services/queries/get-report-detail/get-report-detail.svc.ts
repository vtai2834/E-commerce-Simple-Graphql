import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { DETAIL_REPORTS_QUERY } from "./get-report-detail.query";
import { IGetReportDetailInput, IGetReportDetailResponse, IParseDataReportDetail } from "./get-report-detail.type";

export class ReportDetailApi extends GraphqlCaller<
  IParseDataReportDetail,
  IGetReportDetailInput,
  IGetReportDetailResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      DETAIL_REPORTS_QUERY,
      (raw) => {
        return {
          patientName: `${raw.getReportDetail?.patient?.firstName} ${raw.getReportDetail?.patient?.lastName}`,
          patientEmail: raw.getReportDetail?.patient?.email,
          patientDob: raw.getReportDetail?.patient?.dob,
          patientId: raw.getReportDetail?.patient?.id,

          physicianId: raw.getReportDetail?.physician?.id,
          physicianName: `${raw.getReportDetail?.physician?.firstName} ${raw.getReportDetail?.physician?.lastName}`,

          dateOfService: `${new Date(raw.getReportDetail?.report?.fromDate).toLocaleDateString()} - ${new Date(raw.getReportDetail?.report?.toDate).toLocaleDateString()}`,

          reportUrl: raw.getReportDetail?.report?.reportUrl,
          reportStatus: raw.getReportDetail?.report?.status,
          note: raw.getReportDetail?.report?.note,
        }
      }
    );
  }
}
