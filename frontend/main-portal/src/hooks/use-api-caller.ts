import { useCallback, useEffect } from "react";
import { useApiResult } from "./useApiResult";
import type { GraphqlCaller } from "@services/graph-caller";
import type { OperationVariables } from "@apollo/client";

interface UseApiCallerOptions<TVariables> {
  auto?: boolean;
  variables?: TVariables;
}

export function useApiCaller<
  TData,
  TVariables extends OperationVariables | undefined = undefined,
  TRawResponse = unknown
>(
  api: GraphqlCaller<TData, TVariables, TRawResponse> | null | undefined,
  options?: UseApiCallerOptions<TVariables>
) {
  const { auto = false, variables } = options ?? {};
  const result = useApiResult(api);

  /**
   * execute: gọi API và cho phép xử lý sau khi xong
   */
  const execute = useCallback(
    async (
      vars?: TVariables,
      onSuccess?: (data: TData) => void,
      onError?: (error: unknown) => void
    ) => {
      if (!api) throw new Error("API instance not provided");

      try {
        const data = await api.execute((vars ?? variables) as TVariables);
        onSuccess?.(data);
        return data;
      } catch (err) {
        onError?.(err);
        throw err;
      }
    },
    [api]
  );

  useEffect(() => {
    if (auto && api) {
      void execute(variables);
    }
  }, [auto, variables]);

  return {
    data: result.data ?? null,
    loading: result.status === "loading",
    error: result.status === "error" ? result.message ?? "Error" : null,
    status: result.status,
    execute,
  };
}
