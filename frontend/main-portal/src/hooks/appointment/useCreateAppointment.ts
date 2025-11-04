import { useCallback, useRef, useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import { toast } from "react-toastify";
import { CreateAppointmentApi } from "@services/mutations/createAppointment/createAppointment.svc";
import { ICreateAppointmentInput, ICreateAppointmentResponse, IParseDataCreateAppointment } from "@services/mutations/createAppointment/createAppointment.type";

export function useCreateAppointment() {
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IParseDataCreateAppointment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiRef = useRef<CreateAppointmentApi>(null);
  if (!apiRef.current) {
    apiRef.current = new CreateAppointmentApi(client);
  }
  const api = apiRef.current;

  const onCreateAppointment = useCallback(async (input: ICreateAppointmentInput) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.execute(input);
      setData(result);
      toast.success("Appointment created successfully!");
      return result;
    } catch (error) {
      console.error("Create appointment error:", error);
      const errorMessage = "Failed to create appointment";
      setError(errorMessage);
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  return { data, loading, error, onCreateAppointment };
}
