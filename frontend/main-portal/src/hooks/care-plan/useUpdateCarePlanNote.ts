import { useCallback, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";
import { TApiResult } from "@services/type";
import { UpdateNoteCarePlanApi } from "@services/mutations/updateNoteCarePlan/updateNoteCarePlan.svc";
import { IUpdateNoteCarePlanInput, IUpdateNoteCarePlanParsed } from "@services/mutations/updateNoteCarePlan/updateNoteCarePlan.type";

export function useUpdateCarePlanNote() {
  const client = useApolloClient();
  const apiRef = useRef<UpdateNoteCarePlanApi>(null);

  if (!apiRef.current) {
    apiRef.current = new UpdateNoteCarePlanApi(client);
  }

  const api = apiRef.current;

  const onHandleUpdateCarePlanNote = useCallback(
    async (
      input: IUpdateNoteCarePlanInput,
      onResult?: (result: TApiResult<IUpdateNoteCarePlanParsed>) => void
    ) => {
      try {
        const parsedData = await api.execute(input).catch((error) => {
          throw new Error(error);
        });
        if (!parsedData) return null;
        return parsedData;
      } catch (err) {
        onResult?.({ status: "error", message: "" });
        throw err;
      }
    },
    []
  );

  return { onHandleUpdateCarePlanNote };
}


