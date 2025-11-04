import { useCallback } from "react";
import { TApiResult } from "@services/type";
import { toast } from "react-toastify";
import { useApi } from "@/contexts/api-provider.context";
import { ICreateReportInput, ICreateReportResponse } from "@/services/mutations/create-report/create-report.type";
import { useApiResult } from "../useApiResult";

export function useCreateReport() {
  const apiService = useApi()
  const api = apiService.carePlan.createReport;

  const result = useApiResult<
    ICreateReportResponse['createReportPdf'],
    ICreateReportInput,
    ICreateReportResponse
  >(api);

  // onHandleCreateReport nhận thêm overrideOption
  const onHandleCreateReport = useCallback(
    async (
      input: ICreateReportInput,
      onResult?: (result: TApiResult<ICreateReportResponse['createReportPdf']>) => void,
      overrideOption?: boolean
    ) => {
      try {
        // Patch thêm field override nếu truyền vào overrideOption
        const finalInput = {
          ...input,
          input: {
            ...input.input,
            override: overrideOption ?? input.input.override ?? false
          }
        }
        await api.execute(finalInput)
          .then((response) => {
            if (response) {
              // Không toast thành công ở đây nữa, để logic phía ngoài quyết
              onResult?.({ status: "success", data: response });
            }
          })
          .catch((error) => {
            toast.error("Create report failed. Please try again.")
            onResult?.({ status: "error", message: error.message || '' });
            throw new Error(error)
          });
      } catch (err) {
        onResult?.({ status: "error", message: '' });
        throw err;
      }
    },
    [api]
  );

  const loading = result.status !== 'success' && result.status !== 'error' && result.status === 'loading';
  const data = result.status === "success" ? result.data : null;
  const error = result.status === "error" ? result.message : null;

  return { onHandleCreateReport, loading, data, error  };
}
