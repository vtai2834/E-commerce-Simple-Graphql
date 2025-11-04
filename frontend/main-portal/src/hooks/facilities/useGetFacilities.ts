import { useEffect, useMemo, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";
import { useApiResult } from "../useApiResult";
import { toast } from "react-toastify";
import { ListFacilityApi } from "@services/queries/get-facilities/get-facilities.svc";
import { IListFacilityInput, IListFacilityResponse } from "@services/queries/get-facilities/get-facilities.type";

export function useListFacilities(ids: string[]) {
  const client = useApolloClient();

  const apiRef = useRef<ListFacilityApi>(null);
  if (!apiRef.current) {
    apiRef.current = new ListFacilityApi(client);
  }
  const api = apiRef.current;

  const result = useApiResult<
    IListFacilityResponse['facilitiesByIds'],
    IListFacilityInput,
    IListFacilityResponse
  >(api);

  const input = useMemo<IListFacilityInput>(() => ({ ids }), [ids]);

  useEffect(() => {
    if (!Array.isArray(input.ids) || input.ids.length === 0) return;
    api.execute(input).catch((error) => {
      console.error("Fetch list CarePlans error aa:", error);
      toast.error("Failed to fetch CarePlans list" );
    });
  }, [api, input]);

  const loading = result.status !== 'success' && result.status !== 'error';
  const data = result.status === "success" ? result.data : null;
  const error = result.status === "error" ? result.message : null;

  return { data, loading, error };
}
