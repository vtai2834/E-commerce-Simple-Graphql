import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { LOGIN_PATIENT_MUTATION } from "./login.mutation";
import { ILoginInput, ILoginResponse, IParseDataLogin } from "./login.type";


// patient-role de dang nhap rieng cho patient .
// Con lai cac loai nguoi dung khac thi o ngoai

export class LoginApi extends GraphqlCaller<  
  IParseDataLogin,
  { input: ILoginInput },
  ILoginResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      LOGIN_PATIENT_MUTATION,
      (raw) => raw.loginPatient,
      "mutation"
    );
  }
}
