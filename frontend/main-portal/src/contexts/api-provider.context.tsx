import { useApolloClient } from "@apollo/client";
import { ApiServices } from "@services/index";
import { createContext, ReactNode, useContext, useEffect, useMemo } from "react";

const ApiContext = createContext<ApiServices | null>(null);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const client = useApolloClient();

  const apiServices = useMemo(() => {
    console.log("🏗️ Creating ApiServices instance");
    return ApiServices.create(client);
  }, [client]);

  useEffect(() => {
    return () => {
      console.log("🧹 Cleaning up ApiServices instance");
      apiServices.clear()
    };
  }, [apiServices]);

  return (
    <ApiContext.Provider value={apiServices}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApiContext = (): ApiServices => {
  const context = useContext(ApiContext);
  
  if (!context) {
    throw new Error("useApiContext must be used within an ApiProvider");
  }
  
  return context;
};

export const useApi = useApiContext;
