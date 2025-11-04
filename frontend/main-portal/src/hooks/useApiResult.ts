import { useSyncExternalStore } from "react";
import type { OperationVariables } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { TApiResult } from "@services/type";

/**
 * Hook to read GraphqlCaller result without manually wiring attach/detach
 * Usage: const result = useApiResult(apiInstance)
 */
export function useApiResult<TData, TVariables extends NoInfer<OperationVariables | undefined> | undefined , TRawResponse = unknown>(
  api: GraphqlCaller<TData, TVariables, TRawResponse> | null | undefined
): TApiResult<TData> {
  const subscribe = (onStoreChange: () => void) =>
    api ? api.subscribe(onStoreChange) : () => {};
  const getSnapshot = () =>
    api ? api.getResult() : ({ status: "idle" } as TApiResult<TData>);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
