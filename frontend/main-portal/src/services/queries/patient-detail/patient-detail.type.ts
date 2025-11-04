export interface IPatientDetailInput {
  email?: string;
  getPatientDetailsId?: string;
  friendlyId?: string;
}

export interface IPatientDetailResponse {
  getPatientDetails: {
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
      };
      carePlanId: string;
    };
    carePlan: {
      note: string;
    }
  };
}
