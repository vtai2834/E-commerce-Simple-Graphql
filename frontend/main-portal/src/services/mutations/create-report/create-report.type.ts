export interface IReport {
  carePlanId: string;
  fromDate: string;
  id: string;
  note: string;
  reportUrl: string;
  toDate: string;
}

export interface ICreateReportResponse {
  createReportPdf: {
    override?: boolean;
    report?: IReport;
  }
}

export interface ICreateReportInput {
  input: {
    friendlyId: string;
    fromDate: string;
    note: string;
    toDate: string;
    override?: boolean;
  }
}
