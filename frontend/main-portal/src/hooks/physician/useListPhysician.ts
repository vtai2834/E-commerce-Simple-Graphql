import { useCallback, useEffect, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";
import { useApiResult } from "../useApiResult";
import { toast } from "react-toastify";
import { GetPhysiciansApi } from "@services/queries/get-physicians/getPhysicians.svc";
import { IGetPhysiciansInput, IGetPhysiciansResponse, IParseDataGetPhysicians } from "@services/queries/get-physicians/getPhysicians.type";

export function useGetPhysicians(facilityId?: string) {
  const client = useApolloClient();

  const apiRef = useRef<GetPhysiciansApi>(null);
  if (!apiRef.current) {
    apiRef.current = new GetPhysiciansApi(client);
  }
  const api = apiRef.current;

  const result = useApiResult<
    IParseDataGetPhysicians['physicians'],
    IGetPhysiciansInput,
    IGetPhysiciansResponse
  >(api);

  const onFetchPhysicians = useCallback(() => {
    const input: IGetPhysiciansInput = facilityId ? { facilityId } : {};

    api.execute(input).catch((error) => {
      console.error("Fetch physicians error:", error);
      toast.error("Failed to fetch physicians");
    });
  }, [facilityId]);

  useEffect(() => {
    onFetchPhysicians()
  }, [onFetchPhysicians, facilityId]);

  const loading = result.status !== 'success' && result.status !== 'error';
  const data = result.status === "success" ? result.data : null;
  const error = result.status === "error" ? result.message : null;

  return { data, loading, error, onFetchPhysicians };
}
