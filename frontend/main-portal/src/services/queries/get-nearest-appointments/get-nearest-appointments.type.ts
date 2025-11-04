import { EAppointmentType, EAppointmentStatus } from "@/services/queries/get-appointments/get-appointments.type";

export interface IGetNearestAppointmentInput {
  patientId: string
}

export interface IParseDataNearestAppointment {
  id: string;
  type: EAppointmentType;
  status: EAppointmentStatus;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    dob: string;
    contactInfo: {
      address: string;
      city: string;
      state: string;
      country: string;
      phone: string;
    };
  };
  physician: {
    firstName: string;
    lastName: string;
  };
  facility: {
    name: string;
  }
  physicianId: string;
  facilityId: string;
  note: string;
  startTime: string;
  stopTime: string;
  duration: number;
  carePlanId: string;
  title: string;
}

export type IParseDataNearestAppointments = IParseDataNearestAppointment[];

export interface IGetNearestAppointmentResponse {
  getNearestAppointment: IParseDataNearestAppointment[];
}
