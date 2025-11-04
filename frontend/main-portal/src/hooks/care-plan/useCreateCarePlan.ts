import { useCallback, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";

import { TApiResult } from "@services/type";
import { CreateCarePlanApi } from "@services/mutations/createCarePlan/createCarePlan.svc";
import { ICreateCarePlanInput, IParseDataCreateCarePlan } from "@services/mutations/createCarePlan/createCarePlan.type";
import { toast } from "react-toastify";


export function useCreateCarePlan() {
  const client = useApolloClient();
  const editApi = useRef<CreateCarePlanApi>(null);

  if (!editApi.current) {
    editApi.current = new CreateCarePlanApi(client);
  }

  const api = editApi.current;

  const onHandleCreateCarePlan = useCallback(
    async (
      input: ICreateCarePlanInput,
      onResult?: (result: TApiResult<IParseDataCreateCarePlan>) => void
    ) => {
      try {

        const parsedData = await api.execute(input).catch((error)=> {
          toast.error("Create care plan failed. Please try again.")
            throw new Error(error)
        }).then(()=> toast.success("Create care plan successfully!"))
        if (!parsedData) return null
        return parsedData;

      } catch (err) {
        onResult?.({ status: "error", message: '' });
        throw err;
      }
    },
    []
  );

  return { onHandleCreateCarePlan };
}
