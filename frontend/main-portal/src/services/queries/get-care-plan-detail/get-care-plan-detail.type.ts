export enum ETypeHealthDataView {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export interface IGetCarePlanDetailInput {
  careplanId: string;
  type?: ETypeHealthDataView;
  filter?: {
    date?: string;
    week?: number;
    month?: number;
    year?: number;
    fromDate?: string;
    toDate?: string;
  };
}


export interface IGetCarePlanDetailResponse {
  getDetailCarePlanById: {
    createdAt: string;

    facility: {
      id: string,
      name: string,
      status: string,
      contactInfo: {
        address: string;
        city: string;
        country: string;
        phone: string;
        state: string;
      }
    },
    friendlyId: number,
    id: number,
    note: string,
    patient: {
      contactInfo: {
        address: string,
        city: string,
        country: string,
        phone: string,
        state: string
      },
      dailyInfo: Array<{
        id: string,
        date: string,
        healthInfo: {
          diastolic: number,
          heartRate: number,
          sleep: number,
          sp02: number,
          steps: number,
          systolic: number,
          weight: number
        }
      }>,
      dob: string,
      email: string,
      firstName: string,
      id: string,
      lastName: string
    },
    start: string,
    status: string,
    stop: string,
    updatedAt: string
  }
}
