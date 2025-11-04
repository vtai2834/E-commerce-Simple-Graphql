import { useCallback, useRef, useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import { ICancelAppointmentInput, IParseDataCancelAppointment } from "@/services/mutations/cancelAppointment/cancelAppointment.type";
import { CancelAppointmentApi } from "@/services/mutations/cancelAppointment/cancelAppointment.svc";

export function useCancelAppointment() {
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IParseDataCancelAppointment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiRef = useRef<CancelAppointmentApi>(null);
  if (!apiRef.current) {
    apiRef.current = new CancelAppointmentApi(client);
  }
  const api = apiRef.current;

  const onCancelAppointment = useCallback(async (input: ICancelAppointmentInput) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.execute(input);
      setData(result);
      return result;
    } catch (error) {
      console.error("Cancel appointment error:", error);
      const errorMessage = "Failed to cancel appointment";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  return { data, loading, error, onCancelAppointment };
}
