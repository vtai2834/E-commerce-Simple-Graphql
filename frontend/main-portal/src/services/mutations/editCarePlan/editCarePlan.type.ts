const enum STATUS {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export interface IParseDataEditCarePlan {
    id: string,
    note: string,
    start: string,
    status: STATUS,
    stop: string,
    physician: {
        id: string,
        firstName: string,
        lastName: string,
        email: string
    }
}

export interface IEditCarePlanInput {
    newPhysicianId: string,
    carePlanFriendlyId: number
}

export interface IEditCarePlanResponse {
    updateCarePlanPhysician: {
        id: string,
        note: string,
        start: string,
        status: STATUS,
        stop: string,
        physician: {
            id: string,
            firstName: string,
            lastName: string,
            email: string
        }
    }
}
