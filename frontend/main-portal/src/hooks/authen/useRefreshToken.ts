import { useCallback, useRef } from "react";
import { useApolloClient } from "@apollo/client/react";


import { useApiResult } from "../useApiResult";

import { TApiResult } from "@services/type";
import { RefreshTokenApi } from "@services/mutations/refreshToken/refreshToken.svc";
import { IParseDataRefreshToken, IRefreshTokenInput, IRefreshTokenGraphqlVariables } from "@services/mutations/refreshToken/refreshToken.type";

export function useRefreshToken() {
  const client = useApolloClient();
  const refreshTokenApiRef = useRef<RefreshTokenApi>(null);

  if (!refreshTokenApiRef.current) {
    refreshTokenApiRef.current = new RefreshTokenApi(client);
  }
  const clientApi = refreshTokenApiRef.current;

  // We'll keep a generic result for now, as we'll handle specific data types in onHandleLogin
  const result = useApiResult<any, any, any>(clientApi); // This might need refinement depending on how you use 'result'

  const onHandleRefreshToken = useCallback(
    async (
      input: IRefreshTokenInput, // Giờ input chỉ chứa refreshToken
      onResult?: (result: TApiResult<IParseDataRefreshToken>) => void
    ) => {
      try {
        const graphqlVariables: IRefreshTokenGraphqlVariables = { input }; // Bọc input vào đúng cấu trúc GraphQL variables
        console.log("GraphQL VARIABLES CỦA REFRESHTOKEN: ", graphqlVariables);

        const parsedData: IParseDataRefreshToken = await clientApi.execute(graphqlVariables); // Truyền biến GraphQL đúng cấu trúc

        console.log("parsed data trong onHandleRefresh: ", parsedData);

        onResult?.({ status: "success", data: parsedData });
        return parsedData;
      } catch (err) {
        onResult?.({ status: "error", message: '' });
        throw err;
      }
    },
    [clientApi]
  );

  return { onHandleRefreshToken, result };
}
