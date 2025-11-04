import { useCallback, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";
import { useApiResult } from "../useApiResult";
import { toast } from "react-toastify";
import { PatientDetailApi } from "@services/queries/patient-detail/patient-detail.svc";
import { IPatientDetailInput, IPatientDetailResponse } from "@services/queries/patient-detail/patient-detail.type";

export function usePatientDetail() {
  const client = useApolloClient();

  const apiRef = useRef<PatientDetailApi>(null);
  if (!apiRef.current) {
    apiRef.current = new PatientDetailApi(client);
  }
  const api = apiRef.current;

  const result = useApiResult<
    IPatientDetailResponse['getPatientDetails'],
    IPatientDetailInput,
    IPatientDetailResponse
  >(api);

  const onFetchPatientDetail = useCallback(async (input: IPatientDetailInput) => {
    await api.execute(input).catch((error) => {
      console.error("Fetch patient detail error:", error);
      toast.error("Failed to fetch patient detail");
    });
  }, [api]);

  const loading = result.status !== 'success' && result.status !== 'error';
  const data = result.status === "success" ? result.data : null;
  const error = result.status === "error" ? result.message : null;

  return { data, loading, error, onFetchPatientDetail };
}
