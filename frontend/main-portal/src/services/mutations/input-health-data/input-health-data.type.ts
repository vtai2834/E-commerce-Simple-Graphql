export interface IInputHealthDataInput{
  patientId: string;
  date: string; 
  healthInfo: {
    weight?: number
    sp02?: number
    systolic?: number
    diastolic?: number
    heartRate?: number
    sleep?: number
    steps?: number
  };
}

export interface IInputHealthDataResponse{
  inputDailyInfo: {
    code: number;
    message: string;
  }
}
