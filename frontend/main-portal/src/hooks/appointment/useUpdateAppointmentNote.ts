import { useCallback, useRef, useState } from "react";
import { useApolloClient } from "@apollo/client/react";
import { UpdateAppointmentNoteApi } from "@/services/mutations/updateAppointmentNote/updateAppointmentNote.svc";
import { IParseDataUpdateAppointmentNote, IUpdateAppointmentNoteInput } from "@/services/mutations/updateAppointmentNote/updateAppointmentNote.type";

export function useUpdateAppointmentNote() {
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IParseDataUpdateAppointmentNote | null>(null);
  const [error, setError] = useState<string | null>(null);

  const apiRef = useRef<UpdateAppointmentNoteApi>(null);
  if (!apiRef.current) {
    apiRef.current = new UpdateAppointmentNoteApi(client);
  }
  const api = apiRef.current;

  const onUpdateAppointmentNote = useCallback(async (input: IUpdateAppointmentNoteInput) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.execute(input);
      setData(result);
      return result;
    } catch (error) {
      console.error("Update appointment note error:", error);
      const errorMessage = "Failed to update appointment note";
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [api]);

  return { data, loading, error, onUpdateAppointmentNote };
}


