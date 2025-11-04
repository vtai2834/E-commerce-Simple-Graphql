import { useEffect, useMemo, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";
import { useApiResult } from "../useApiResult";
import { toast } from "react-toastify";
import { GetPatientsByFacilityApi } from "@services/queries/get-patients-by-facility/getPatients.svc";
import { IGetPatientsResponse, IGetPatientsInput } from "@services/queries/get-patients-by-facility/getPatients.type";

export function useListPatients(id: string) {
  const client = useApolloClient();

  const apiRef = useRef<GetPatientsByFacilityApi>(null);
  if (!apiRef.current) {
    apiRef.current = new GetPatientsByFacilityApi(client);
  }
  const api = apiRef.current;

  const result = useApiResult<
    IGetPatientsResponse['getListPatients'],
    IGetPatientsInput,
    IGetPatientsResponse
  >(api);

  const input = useMemo<IGetPatientsInput>(() => ({ input: { 
    facilityId: id
  } }), [id]);

  useEffect(() => {

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
