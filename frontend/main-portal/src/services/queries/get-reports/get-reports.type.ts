export enum EReportStatus {
  GENERATING = 'Generating',
  GENERATED = 'Generated',
  REVIEWED = 'Reviewed',
  FAILED = 'Failed'
}
export interface IGetListReportsInput {
  filter: {
    physicianId?: string;
    friendlyId?: string;
    reportId?: string;

    pagination?: {
      page: number;
      limit: number;
    };
  }
}

export interface IParaseDataListReport {
  title: string,
  start: string,
  end: string,

  extendedProps: {
    appointment: {
      id: string

      type: string
      physicianId: string
      facilityId: string
      note: string
      startTime: string
      stopTime: string
      duration: number
      carePlanId: string
      title: string
    },
    physician: {
      firstName: string
      lastName: string
    }
    patient: {
      id: string,
      fullName: string,
      phone: string,
      duration: number,
      dob: string,
      contactInfo: {
        address: string,
        city: string,
        state: string,
        country: string,
        phone: string
      }
    }
  }
}

export type IParaseDataListReports = IParaseDataListReport[];

export interface IGetListReportsResponse {
  getListReports: {
    reports: {
    id: string
    carePlanId: string
    fromDate: string
    toDate: string
    note: string
    status: EReportStatus
    reportUrl: string
  }[],

  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }}
}
