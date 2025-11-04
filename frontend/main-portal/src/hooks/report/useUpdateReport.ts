import { IUpdateReportInput, IUpdateReportResponse } from '@/services/mutations/update-report/update-report.type';
import { useApiResult } from '@hooks/useApiResult';
import { useCallback } from 'react';
import { toast } from "react-toastify";
import { useApiContext } from "src/context/api-provider.context";

export function useUpdateReport() {
  const apiService = useApiContext();

  const api = apiService.carePlan.updateReport;

  const result = useApiResult<
    IUpdateReportResponse['updateReport'],
    IUpdateReportInput,
    IUpdateReportResponse
  >(api);

  const onHandleUpdateReport = useCallback(async (input: IUpdateReportInput )=>{
    return await api.execute(input)
      .then(()=> toast.success("Update report successfully"))
      .catch((error)=>{
        toast.error(error.message || "Update report failed");
        throw error;
    });
  }, [api]);

  const loading = result.status !== 'success' && result.status !== 'error' && result.status === 'loading';
  const data = result.status === "success" ? result.data : null;
  const error = result.status === "error" ? result.message : null;

  return {
    onHandleUpdateReport,
    
    loading,
    data,
    error
  };
}
