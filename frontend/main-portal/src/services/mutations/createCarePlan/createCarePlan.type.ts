
export interface IParseDataCreateCarePlan {
    id?: string
    error?: {
        message: string,
        code: number,
        details: string
    }
}

export interface ICreateCarePlanInput {
    input: {
        facilityId: string,
        note: string,
        patientId: string,
        physicianId: string,
    }
}

export interface ICreateCarePlanResponse {
    createCarePlan: {
        id: string
    }
}
