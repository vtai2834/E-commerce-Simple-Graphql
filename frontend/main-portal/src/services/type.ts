export type TApiState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: unknown 
};

export type TOperation = "query" | "mutation";

export type TApiDefaultRes = {
  code?: number
  message?: string
  status: "idle" | "loading" | "success" | "error"
}

export type TApiResult<TVal = unknown> = TApiDefaultRes & {
  data?: DeepNullable<TVal>
}
