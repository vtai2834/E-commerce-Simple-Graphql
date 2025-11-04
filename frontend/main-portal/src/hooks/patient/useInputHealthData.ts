import { useCallback, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";

import { toast } from "react-toastify";
import { useApiResult } from "../useApiResult";
import { InputHealthDataApi } from "@services/mutations/input-health-data/input-health-data.svc";
import { IInputHealthDataInput, IInputHealthDataResponse } from "@services/mutations/input-health-data/input-health-data.type";
import { TApiResult } from "@services/type";

export function useInputHealthData() {
  const client = useApolloClient();
  const apiRef = useRef<InputHealthDataApi>(null);

  if (!apiRef.current) {
    apiRef.current = new InputHealthDataApi(client);
  }
  const api = apiRef.current;

  const result = useApiResult<
    IInputHealthDataResponse['inputDailyInfo'],
    IInputHealthDataInput,
    IInputHealthDataResponse
  >(api);

  const handleInputHealthData = useCallback(
    async (
      input: IInputHealthDataInput,
      onResult?: (result: TApiResult<IInputHealthDataResponse['inputDailyInfo']>) => void
    ) => {
      try {
        const parsed = await api.execute(input);
        toast.success("Input health data successfully");
        onResult?.({ status: "success", data: parsed });
        return parsed;
      } catch (err) {
        onResult?.({ status: "error", message: '' });
        toast.error("Input health data failed");
        throw err;
      }
    },
    [api]
  );

  return { handleInputHealthData, result };
}
