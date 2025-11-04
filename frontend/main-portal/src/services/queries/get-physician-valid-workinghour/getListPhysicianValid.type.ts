export interface IParseDataGetPhysiciansValid {
    data: IPhysicianValid[];
}

export interface IPhysicianValid {
    id?: string;
    email?: string;
    lastName?: string;
    firstName?: string;
    fullName?: string;
    phone?: string;
}

export interface IGetPhysiciansValidInput {
    input: {
        facilityId: string;
        date: string;
        time: string;
        duration: number;
    }
}

export interface IGetPhysiciansValidResponse {
    getListPhysicianValid: {
        data: IPhysicianValid[];
        total? : number;
    };
}
