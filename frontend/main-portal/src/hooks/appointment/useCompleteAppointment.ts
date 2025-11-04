import { useCallback, useRef, useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import { CompleteAppointmentApi } from "@/services/mutations/completeAppointment/completeAppointment.svc";
import { ICompleteAppointmentInput, IParseDataCompleteAppointment } from "@/services/mutations/completeAppointment/completeAppointment.type";

export function useCompleteAppointment() {
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IParseDataCompleteAppointment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiRef = useRef<CompleteAppointmentApi>(null);
  if (!apiRef.current) {
    apiRef.current = new CompleteAppointmentApi(client);
  }
  const api = apiRef.current;

  const onCompleteAppointment = useCallback(async (input: ICompleteAppointmentInput) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.execute(input);
      setData(result);
      return result;
    } catch (error) {
      console.error("Complete appointment error:", error);
      const errorMessage = "Failed to complete appointment";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  return { data, loading, error, onCompleteAppointment };
}
