import { IReGenerateReportInput, IReGenerateReportResponse } from '@/services/mutations/re-generate-report/re-generate-report.type';
import { useApiResult } from '@hooks/useApiResult';
import { useCallback } from 'react';
import { toast } from "react-toastify";
import { useApiContext } from "src/contexts/api-provider.context";

export function useRegenerateReport() {
  const apiService = useApiContext();

  const api = apiService.carePlan.reGenerateReport;

  const result = useApiResult<
    IReGenerateReportResponse['reGenerateReport'],
    IReGenerateReportInput,
    IReGenerateReportResponse
  >(api);

  const onHandleRegenerateReport = useCallback(async (input: IReGenerateReportInput )=>{
    return await api.execute(input)
      .then(()=> toast.success("Regenerate report successfully"))
      .catch((error)=>{
        toast.error(error.message || "Regenerate report failed");
        throw error;
    });
  }, [api]);

  const loading = result.status !== 'success' && result.status !== 'error' && result.status === 'loading';
  const data = result.status === "success" ? result.data : null;
  const error = result.status === "error" ? result.message : null;

  return {
    onHandleRegenerateReport,

    loading,
    data,
    error
  };
}
