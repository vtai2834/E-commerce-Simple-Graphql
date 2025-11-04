export interface IParseDataCompleteAppointment {
    appointmentId: string;
    isSuccess: boolean

}

export interface ICompleteAppointmentInput {
    appointmentId: string;
}

export interface ICompleteAppointmentResponse {
    completeAppointment: {
        appointmentId: string;
        isSuccess: boolean;
    }
}
