import { useApolloClient } from "@apollo/client";
import { useApiResult } from "@hooks/useApiResult";
import { CarePlansDetailApi } from "@services/queries/get-care-plan-detail/get-care-plan-detail.svc";
import { IGetCarePlanDetailInput, IGetCarePlanDetailResponse } from "@services/queries/get-care-plan-detail/get-care-plan-detail.type";
import { useCallback, useRef } from "react";
import { toast } from "react-toastify";

export function useDetailCarePlan() {
  const client = useApolloClient();
  const detailApi = useRef<CarePlansDetailApi>(null);

  if (!detailApi.current) {
    detailApi.current = new CarePlansDetailApi(client);
  }

  const api = detailApi.current;

  const result = useApiResult<
    IGetCarePlanDetailResponse['getDetailCarePlanById'],
    IGetCarePlanDetailInput,
    IGetCarePlanDetailResponse
  >(api);

  const onHandleGetDetailCarePlanById = useCallback(
    async (
      input: IGetCarePlanDetailInput
    ) => {
      api.execute(input)
        .then(() => toast.success("Fetch CarePlan detail successfully"))
        .catch((error) => {
          console.error("Fetch CarePlan detail error:", error);
          toast.error("Failed to fetch CarePlan detail");
        });
    },
    []
  );

  return {
    onHandleGetDetailCarePlanById,
    data: result.status === "success" ? result.data : null,
    loading: result.status !== 'success' && result.status !== 'error',
    error: result.status === "error" ? result.message : null,
  };
}
