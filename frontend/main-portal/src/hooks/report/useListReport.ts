import { IGetListReportsInput, IGetListReportsResponse } from '@/services/queries/get-reports/get-reports.type';
import { useApiResult } from '@hooks/useApiResult';
import { useCallback } from 'react';
import { toast } from "react-toastify";
import { useApiContext } from "@/contexts/api-provider.context";

export function useListReports() {
  const apiService = useApiContext();

  const api = apiService.carePlan.listReports;

  const result = useApiResult<
    IGetListReportsResponse['getListReports'],
    IGetListReportsInput,
    IGetListReportsResponse
  >(api);

  const onHandleGetReports = useCallback(async (input: IGetListReportsInput )=>{
    return await api.execute(input)
      .then(()=> toast.success("Fetch reports successfully"))
      .catch((error)=>{
      toast.error(error.message || "Fetch reports failed");
      throw error;
    });
  }, [api]);

  const loading = result.status !== 'success' && result.status !== 'error';
  const data = result.status === "success" ? result.data : null;
  const error = result.status === "error" ? result.message : null;

  return {
    onHandleGetReports,
    
    loading,
    data,
    error
  };
}
