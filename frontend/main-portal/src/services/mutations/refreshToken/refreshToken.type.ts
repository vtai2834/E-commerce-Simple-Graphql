
export interface IParseDataRefreshToken {
    code?: number;
    accessToken?: string;
    refreshToken?: string;
    isSuccess?: boolean;
    message?: string;
}

export interface IRefreshTokenResponse {
    refreshToken: {
        code?: number;
        accessToken?: string;
        refreshToken?: string;
        isSuccess?: boolean;
        message?: string;
    }
}


export interface IRefreshTokenInput {
    refreshToken: string;
}

// Định nghĩa cấu trúc biến GraphQL mà mutation mong đợi
export interface IRefreshTokenGraphqlVariables {
    input: {
        refreshToken: string;
    }
}
