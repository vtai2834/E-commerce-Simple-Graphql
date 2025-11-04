export interface IListFacilityInput {
    ids: string[]
}
export interface IListFacilityResponse {
    facilitiesByIds: [
        {
            id: string,
            name: string,
            status: string,
            contactInfo?: {
                address?: string,
            }
        }
    ]
}
