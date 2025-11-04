import { useCallback, useRef, useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import { GetNearestAppointmentApi } from "@/services/queries/get-nearest-appointments/get-nearest-appointments.svc";
import { IGetNearestAppointmentInput, IParseDataNearestAppointments } from "@/services/queries/get-nearest-appointments/get-nearest-appointments.type";

export function useGetNearestAppointment() {
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IParseDataNearestAppointments | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiRef = useRef<GetNearestAppointmentApi | null>(null);
  if (!apiRef.current) {
    apiRef.current = new GetNearestAppointmentApi(client);
  }
  const api = apiRef.current;

  const getNearestAppointment = useCallback(
    async (input: IGetNearestAppointmentInput) => {
      setLoading(true);
      setError(null);
      try {
        const result = await api.execute(input);
        setData(result);
        return result;
      } catch (err) {
        setError("Failed to fetch nearest appointments");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  return { data, loading, error, getNearestAppointment };
}
