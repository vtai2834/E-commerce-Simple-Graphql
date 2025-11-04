export interface IParseDataGetPhysicians {
    physicians: IPhysician[];
}

export interface IPhysician {
    id?: string;
    lastName?: string;
    firstName?: string;
}

export interface IGetPhysiciansInput {
    facilityId?: string;
}

export interface IGetPhysiciansResponse {
    physiciansList: {
        physicians: IPhysician[];
    };
}
