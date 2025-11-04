import { useCallback, useEffect, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";

import { useApiResult } from "./useApiResult";

import { TApiResult } from "@services/type";
import { GetMeInfoApi } from "@services/queries/get-me-info/getMeInfo.svc";
import { IGetMeInfoResponse, IParseDataGetMeInfo } from "@services/queries/get-me-info/getMeInfo.type";
import { useDispatch } from "react-redux";
import { meInfo } from "@store/authenticator-slice";

export function useGetMeInfo(token?: string) {
  const client = useApolloClient();

  const infoApiRef = useRef<GetMeInfoApi | null>(null);

  const dispatch = useDispatch();

  if (!infoApiRef.current) {
    infoApiRef.current = new GetMeInfoApi(client);
  }
  const clientApi = infoApiRef.current;

  const result = useApiResult<
    IParseDataGetMeInfo,
    undefined,
    IGetMeInfoResponse
  >(clientApi);

  const onHandleGetMeInfo = useCallback(
    async (
        onResult?: (result: TApiResult<IParseDataGetMeInfo>) => void
    ) => {
      try {
        const parsedData: IParseDataGetMeInfo = await clientApi.execute(undefined);

        dispatch(meInfo({
          authenticated: true,
          user: {
            id: parsedData.user?.id ?? '',
            email: parsedData.user?.email ?? '',
            firstName: parsedData.user?.firstName ?? '',
            lastName: parsedData.user?.lastName ?? '',
            dob: parsedData.user?.dob ?? '',
            role: parsedData.user?.role ?? "PATIENT",
            facilities: parsedData.user?.facilities ?? [],
          }
        }));

        onResult?.({ status: "success", data: parsedData });
        return parsedData;
      } catch (err) {
        onResult?.({ status: "error", message: '' });
        throw err;
      }
    },
    [clientApi] 
  );

  const data = result.data;
  const loading = result.status === 'loading';
  const error = result.status === 'error' ? result.message : undefined;

  useEffect(() => {
    if (!token) return;

    console.log("Run effect with token (from useGetMeInfo): ", token);

    const getMeInfo = async () => {
      await onHandleGetMeInfo();
    }
    getMeInfo();
  }, [token, onHandleGetMeInfo]);

  return { onHandleGetMeInfo, data, loading, error };
}
