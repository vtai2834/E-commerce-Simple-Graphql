export enum ECarePlanStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface IListCarePlansVariables {
  filter?: {
    physicianId?: string;
    pagination?: {
      page: number;
      limit: number;
    };
    status: ECarePlanStatus
    patientEmail?: string;
  }
}

export interface IPaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ICarePlanItem {
  id: string;
  friendlyId: string;
  note: string;
  start: string;
  stop: string;
  status: string;
  facility: {
    id: string;
    name: string;
    status: string;
    contactInfo: {
      address: string;
      city: string;
      country: string;
      phone: string;
      state: string;
    }
  };
  patient: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    dob: string;
    contactInfo: {
      address: string;
      city: string;
      country: string;
      phone: string;
      state: string;
    }
  };

  physician: {
    id: string;
    firstName: string;
    lastName: string;
    dob: string;
    contactInfo: {
      address: string;
      city: string;
      country: string;
      phone: string;
      state: string;
    }
  };

}

export interface IListCarePlansResponse {
  getListCarePlans: {
    data: ICarePlanItem[];
    pagination: IPaginationInfo;
  }
}

export interface ICarePlanDetailParaseData {
  data: {
    id: string;
    friendlyId: string;
    note: string;
    start: string;
    stop: string;
    status: string;

    facilityId: string;
    facilityName: string;

    patientId: string;
    patientEmail: string;
    patientFirstName: string;
    patientLastName: string;
    patientDob: string;
    patientPhone: string;
    patientAddress: string;
    patientCity: string;
    patientCountry: string;

    physicianId: string;
    physicianFirstName: string;
    physicianLastName: string;
    physicianDob: string;
    physicianPhone: string;
    physicianAddress: string;
    physicianCity: string;
    physicianCountry: string;
  }[]

  pagination: IPaginationInfo;
}
