export interface IParseDataLogout {
    code: number
    message : string
}

export interface ILogoutGraphqlVariables {
    input: {
        userId: string
    }
}

export interface ILogoutResponse {
    logout: {
        code: number
        message : string
    }
}
