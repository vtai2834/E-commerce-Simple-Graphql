import { useCallback, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";
import { LoginApi } from "@services/mutations/login/patient-role/login.svc";
import { PhysicianLoginApi } from "@services/mutations/login/physicianLogin.svc";
import { ILoginInput, IParseDataLogin } from "@services/mutations/login/patient-role/login.type";
import { IParseDataPhysicianLogin } from "@services/mutations/login/physicianLogin.type";
import { TApiResult } from "@services/type";

export function useLogin() {
  const client = useApolloClient();
  const patientApiRef = useRef<LoginApi>(null);
  const physicianApiRef = useRef<PhysicianLoginApi>(null);

  if (!patientApiRef.current) {
    patientApiRef.current = new LoginApi(client);
  }
  const patientApi = patientApiRef.current;

  if (!physicianApiRef.current) {
    physicianApiRef.current = new PhysicianLoginApi(client);
  }
  
  const physicianApi = physicianApiRef.current;

  const onHandleLogin = useCallback(
    async (
      input: ILoginInput,
      role: "PATIENT" | "PHYSICIAN",
      onResult?: (result: TApiResult<IParseDataLogin | IParseDataPhysicianLogin>) => void
    ) => {
      try {
        let parsedData: IParseDataLogin | IParseDataPhysicianLogin;

        if (role === "PATIENT") {
          parsedData = await patientApi.execute({ input: input });
        } else if (role === "PHYSICIAN") {
          parsedData = await physicianApi.execute({ input: input });
        } else {
          throw new Error("Invalid role provided");
        }

        onResult?.({ status: "success", data: parsedData });
        return parsedData;
      } catch (err) {
        onResult?.({ status: "error", message: '' });
        throw err;
      }
    },
    [patientApi, physicianApi]
  );

  return { onHandleLogin };
}
