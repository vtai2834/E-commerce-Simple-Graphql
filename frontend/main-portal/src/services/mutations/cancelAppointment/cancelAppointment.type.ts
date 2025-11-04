export interface IParseDataCancelAppointment {
    appointmentId: string;
    isSuccess: boolean

}

export interface ICancelAppointmentInput {
    appointmentId: string;
}

export interface ICancelAppointmentResponse {
    cancelAppointment: {
        appointmentId: string;
        isSuccess: boolean;
    }
}
