import { useCallback, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";
import { TApiResult } from "@services/type";
import { EditCarePlanApi } from "@services/mutations/editCarePlan/editCarePlan.svc";
import { IEditCarePlanInput, IParseDataEditCarePlan } from "@services/mutations/editCarePlan/editCarePlan.type";

export function useEditCarePlan() {
  const client = useApolloClient();
  const editApi = useRef<EditCarePlanApi>(null);

  if (!editApi.current) {
    editApi.current = new EditCarePlanApi(client);
  }

  const api = editApi.current;

  const onHandleEditCarePlan = useCallback(
    async (
      input: IEditCarePlanInput,
      onResult?: (result: TApiResult<IParseDataEditCarePlan>) => void
    ) => {
      try {

        const parsedData = await api.execute(
          { 
            carePlanFriendlyId: input.carePlanFriendlyId, 
            newPhysicianId: input.newPhysicianId
          }).catch((error)=> {
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

  return { onHandleEditCarePlan };
}
