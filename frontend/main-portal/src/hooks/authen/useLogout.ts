import { useCallback, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";
import {  IParseDataLogin } from "@services/mutations/login/patient-role/login.type";
import { IParseDataPhysicianLogin } from "@services/mutations/login/physicianLogin.type";
import { TApiResult } from "@services/type";
import { LogoutApi } from "@services/mutations/logout/logout.svc";
import { ILogoutGraphqlVariables } from "@services/mutations/logout/logout.type";
import Cookies from "js-cookie";
import { SSOCOOKIES } from "@constants/index";
import { useNavigate } from "react-router-dom";


export function useLogout() {
  const client = useApolloClient();
  const logoutApi = useRef<LogoutApi>(null);
  const navigate = useNavigate();

  if (!logoutApi.current) {
    logoutApi.current = new LogoutApi(client);
  }

  const api = logoutApi.current;

  const onHandleLogout = useCallback(
    async (
      input: ILogoutGraphqlVariables,
      onResult?: (result: TApiResult<IParseDataLogin | IParseDataPhysicianLogin>) => void
    ) => {
      try {

        console.log("input: ", input)

        await api.execute(input).catch((error)=> {
            throw new Error(error)
        })

        Cookies.remove(SSOCOOKIES.access);
        Cookies.remove(SSOCOOKIES.refresh);

        navigate('/login');

      } catch (err) {
        onResult?.({ status: "error", message: '' });
        throw err;
      }
    },
    []
  );

  return { onHandleLogout };
}
