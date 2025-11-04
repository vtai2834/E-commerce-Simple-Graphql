export interface IParseDataCreateAppointment {
    id?: string
    error?: {
        message: string,
        code: number,
        details: string
    }
}

export interface ICreateAppointmentInput {
    input: {
        type: 'IN_PERSON' | 'VIRTUAL',
        patientId: string,
        physicianId: string,
        facilityId: string,
        note?: string,
        startTime: string, // Format: "YYYY-MM-DDTHH:mm:ss"
        duration: number,
        carePlanId?: string | null,
        title: string,
    }
}

export interface ICreateAppointmentResponse {
    createAppointment: {
        id: string,
        type: string,
        status: string,
        patientId: string,
        physicianId: string,
        facilityId: string,
        note?: string,
        startTime: string,
        stopTime: string,
        duration: number,
        carePlanId?: string,
        title: string,
        createdAt: string,
        updatedAt: string,
    }
}
