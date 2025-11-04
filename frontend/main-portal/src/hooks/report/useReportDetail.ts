import { IGetReportDetailInput, IGetReportDetailResponse, IParseDataReportDetail } from '@/services/queries/get-report-detail/get-report-detail.type';
import { useApiResult } from '@hooks/useApiResult';
import { useCallback } from 'react';
import { toast } from "react-toastify";
import { useApiContext } from "@/contexts/api-provider.context";

export function useReportDetail() {
  const apiService = useApiContext();

  const api = apiService.carePlan.reportDetail

  const result = useApiResult<
    IParseDataReportDetail,
    IGetReportDetailInput,
    IGetReportDetailResponse
  >(api);

  const onHandleGetReportDetail = useCallback(async (input: IGetReportDetailInput )=>{
    return await api.execute(input)
      .then(()=> toast.success("Fetch report detail successfully"))
      .catch((error)=>{
      toast.error(error.message || "Fetch report detail failed");
      throw error;
    });
  }, [api]);

  const loading = result.status !== 'success' && result.status !== 'error' && result.status === 'loading';
  const data = result.status === "success" ? result.data : null;
  const error = result.status === "error" ? result.message : null;

  return {
    onHandleGetReportDetail,
    
    loading,
    data,
    error
  };
}
