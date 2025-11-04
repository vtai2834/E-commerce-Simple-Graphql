
export interface IParseDataStopCarePlan {
    id: string
}

export interface IStopCarePlanInput {
    carePlanFriendlyId: number
}

export interface IStopCarePlanResponse {
    stopCarePlan: {
        id: string
    }
}
