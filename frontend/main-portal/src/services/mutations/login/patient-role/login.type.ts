export interface IParseDataLogin {
  isSuccess: boolean,
  message: string;
  code: number,
  accessToken: string,
  refreshToken: string,
  user: {
    dob: string,
    email: string,
    firstName: string,
    lastName: string,
    id: string
    role: "PHYSICIAN" | "PATIENT"
  }
}

export interface ILoginInput {
  email?: string,
  password?: string,
  role?: string
}

export interface ILoginResponse {
  loginPatient: {
    isSuccess: boolean,
    message: string;
    code: number, //mã code thành công | thất bại
    accessToken: string,
    refreshToken: string,
    user: {
      dob: string,
      email: string,
      firstName: string,
      lastName: string,
      id: string,
      role: "PHYSICIAN" | "PATIENT"
    }
  }
}
