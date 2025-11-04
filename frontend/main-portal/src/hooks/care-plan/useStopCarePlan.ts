import { useCallback, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";
import { TApiResult } from "@services/type";
import { StopCarePlanApi } from "@services/mutations/stopCarePlan/stopCarePlan.svc";
import { IParseDataStopCarePlan, IStopCarePlanInput } from "@services/mutations/stopCarePlan/stopCarePlan.type";


export function useStopCarePlan() {
  const client = useApolloClient();
  const editApi = useRef<StopCarePlanApi>(null);

  if (!editApi.current) {
    editApi.current = new StopCarePlanApi(client);
  }

  const api = editApi.current;

  const onHandleStopCarePlan = useCallback(
    async (
      input: IStopCarePlanInput,
      onResult?: (result: TApiResult<IParseDataStopCarePlan>) => void
    ) => {
      try {

        const parsedData = await api.execute(input).catch((error)=> {
            throw new Error(error)
        })
        if (!parsedData) return null
        return parsedData;

      } catch (err) {
        onResult?.({ status: "error", message: '' });
        throw err;
      }
    },
    []
  );

  return { onHandleStopCarePlan };
}
