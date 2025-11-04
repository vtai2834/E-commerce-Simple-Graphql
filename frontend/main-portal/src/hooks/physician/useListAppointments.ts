import { useApiResult } from '@hooks/useApiResult';
import { IGetListAppointmentsInput, IGetListAppointmentsResponse, IParaseDataListAppointments } from "@services/queries/get-appointments/get-appointments.type";
import { toast } from "react-toastify";
import { useApiContext } from "@/contexts/api-provider.context";

export function useListAppointments() {
  const apiService = useApiContext();

  const api = apiService.appointment.listAppointments;

  const result = useApiResult<
    IParaseDataListAppointments,
    IGetListAppointmentsInput,
    IGetListAppointmentsResponse
  >(api);

  const onHandleGetAppointments = async (input: IGetListAppointmentsInput )=>{
    return await api.execute(input)
      .then(()=> toast.success("Fetch appointments successfully"))
      .catch((error)=>{
      toast.error(error.message || "Fetch appointments failed");
      throw error;
    });
  }

  const loading = result.status !== 'success' && result.status !== 'error';
  const data = result.status === "success" ? result.data : null;
  const error = result.status === "error" ? result.message : null;

  return {
    onHandleGetAppointments,
    
    loading,
    data,
    error
  };
}
