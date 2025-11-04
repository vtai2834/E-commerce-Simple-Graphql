export interface IParseDataGetMeInfo {
    code?: number;
    isSuccess?: boolean;
    accessToken?: string;
    refreshToken?: string;
    user?: {
        dob?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        id?: string;
        role?: "PATIENT" | "PHYSICIAN";
        facilities?: string[];
    };
    message?: string;
}

export interface IGetMeInfoResponse {
    getMeInfo: {
        code?: number;
        isSuccess?: boolean;
        accessToken?: string,
        refreshToken?: string,
        user?: {
            dob?: string,
            email?: string,
            firstName?: string,
            id?: string,
            lastName?: string,
            role?: "PATIENT" | "PHYSICIAN",
            facilities?: string[],
        }
        message?: string;
    }
}
