type Patient = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    carePlanId: string;
    dob: string;
    contactInfo: {
      phone: string;
    };
    
    // name?: string;
    // phone?: string;
  };
  
  export interface IParseDataGetPatients {
    data: Patient[];
  }
  
  export interface IGetPatientsResponse {
    getListPatients: {
      data: Patient[];
      total?: number; // nếu API trả về
    };
  }

export interface IGetPatientsInput {
  input: {
    facilityId: string;
  };
}