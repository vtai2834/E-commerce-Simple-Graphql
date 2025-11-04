export interface IReGenerateReportInput {
  reportId: string;
}

export interface IReGenerateReportResponse {
  reGenerateReport: {
    reportUrl: string;
  };
}
