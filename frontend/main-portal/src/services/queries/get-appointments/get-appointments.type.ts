export enum EAppointmentType {
  IN_PERSON = "IN_PERSON",
  VIRTUAL = "VIRTUAL"
}

export enum EAppointmentStatus {
  SCHEDULED = "SCHEDULED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export enum ETypeInputListAppointment {
  daily = "daily",
  weekly = "weekly",
  monthly = "monthly"
}

export interface IGetListAppointmentsInput {
  physicianId: string

  filter: {
    type: ETypeInputListAppointment,
    date: string
  }
}

export interface IParaseDataListAppointment {
  title: string,
  start: string,
  end: string,

  extendedProps: {
    appointment: {
      id: string
      status: EAppointmentStatus

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

export type IParaseDataListAppointments = IParaseDataListAppointment[];

export interface IGetListAppointmentsResponse {
  getAppointments: {
    id: string
    type: EAppointmentType
    status: EAppointmentStatus
    patient: {
      id: string
      firstName: string
      lastName: string
      dob: string
      contactInfo: {
        address: string
        city: string
        state: string
        country: string
        phone: string
      }
    }
    physician: {
      firstName: string
      lastName: string
    }
    physicianId: string
    facilityId: string
    note: string
    startTime: string
    stopTime: string
    duration: number
    carePlanId: string
    title: string
  }[]
}
