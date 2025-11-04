import { EReportStatus } from "@/services/queries/get-reports/get-reports.type";

export interface IUpdateReportInput {
  reportId: string;
  input:{
    note?: string;
    status?: EReportStatus
  }
}

export interface IUpdateReportResponse {
  updateReport: {
    note: string;
    status?: EReportStatus;
  };
}

