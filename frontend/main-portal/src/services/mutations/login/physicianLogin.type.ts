import { ILoginInput } from "./patient-role/login.type";

export interface IParseDataPhysicianLogin {
  isSuccess: boolean,
  message: string;
  code: number,
  accessToken: string;
  refreshToken: string;
  user: {
    dob: string;
    email: string;
    firstName: string;
    lastName: string;
    id: string;
    role: "PHYSICIAN" | "PATIENT";
    facilities: string[];
  };
}

export interface IPhysicianLoginResponse {
  loginPhysician: {
    isSuccess: boolean,
    message: string;
    code: number,
    accessToken: string;
    refreshToken: string;
    user: {
      dob: string;
      email: string;
      firstName: string;
      lastName: string;
      id: string;
      role: "PHYSICIAN" | "PATIENT";
      facilities: string[];
    };
  };
}

export type IPhysicianLoginInput = ILoginInput;
