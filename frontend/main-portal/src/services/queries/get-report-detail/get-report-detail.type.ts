import { EReportStatus } from "../get-reports/get-reports.type";

export interface IGetReportDetailResponse {
  getReportDetail: {
    patient: {
      dob: string;
      email: string;
      firstName: string;
      id: string;
      lastName: string;
    };
    physician: {
      id: string;
      firstName: string;
      lastName: string;
    };
    report: {
      fromDate: string;
      id: string;
      note: string;
      reportUrl: string;
      toDate: string;
      status: EReportStatus
    };
  };
}

export interface IParseDataReportDetail {
  patientName: string;
  patientEmail: string;
  patientDob: string;
  patientId: string;

  physicianId: string;
  physicianName: string;

  dateOfService: string;
  
  reportUrl: string;
  reportStatus: EReportStatus;
  note: string;
}

export interface IGetReportDetailInput {
  reportId: string;
}
