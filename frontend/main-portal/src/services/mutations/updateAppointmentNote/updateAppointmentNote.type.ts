export interface IParseDataUpdateAppointmentNote {
    appointmentId: string;
    isSuccess: boolean

}

export interface IUpdateAppointmentNoteInput {
    appointmentId: string;
    note: string;
}

export interface IUpdateAppointmentNoteResponse {
    updateAppointmentNote: {
        appointmentId: string;
        isSuccess: boolean;
    }
}


