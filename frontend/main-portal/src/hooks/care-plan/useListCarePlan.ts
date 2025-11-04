import { useCallback, useEffect, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";
import { useApiResult } from "../useApiResult";
import { toast } from "react-toastify";
import { ListCarePlansApi } from "@services/queries/get-care-plans/get-care-plans.svc";
import { ICarePlanDetailParaseData, IListCarePlansResponse, IListCarePlansVariables } from "@services/queries/get-care-plans/get-care-plans.type";

export function useListCarePlans(variables: IListCarePlansVariables) {
  const client = useApolloClient();

  const apiRef = useRef<ListCarePlansApi>(null);
  if (!apiRef.current) {
    apiRef.current = new ListCarePlansApi(client);
  }
  const api = apiRef.current;

  const result = useApiResult<
    ICarePlanDetailParaseData, // Parsed data type
    IListCarePlansVariables, // Input variables type
    IListCarePlansResponse
  >(api);

  const onFetchListCarePlans = useCallback(() => {
    api.execute(variables).catch((error) => {
      console.error("Fetch list CarePlans error:", error);
      toast.error("Failed to fetch CarePlans list" );
    });
  }, [variables, api]);

  useEffect(() => {
    onFetchListCarePlans()
  }, [api, onFetchListCarePlans, variables]);

  const loading = result.status !== 'success' && result.status !== 'error';
  const data = result.status === "success" ? result.data : null;
  const error = result.status === "error" ? result.message : null;

  return { data, loading, error, onFetchListCarePlans };
}
