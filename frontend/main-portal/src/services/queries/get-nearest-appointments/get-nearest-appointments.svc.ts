import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@/services/graph-caller";
import { GET_NEAREST_APPOINTMENT_QUERY } from "./get-nearest-appointments.query";
import { IGetNearestAppointmentInput, IGetNearestAppointmentResponse, IParseDataNearestAppointments } from "./get-nearest-appointments.type";
import dayjs from "dayjs";

export class GetNearestAppointmentApi extends GraphqlCaller<IParseDataNearestAppointments, IGetNearestAppointmentInput, IGetNearestAppointmentResponse> {
  constructor(client: ApolloClient<any>) {
    super(
      client,
      GET_NEAREST_APPOINTMENT_QUERY,
      (raw) => {
        if (!raw.getNearestAppointment) return [];
        return raw.getNearestAppointment.map((appointment: any) => ({
          ...appointment,
          start: dayjs(appointment.startTime).toISOString(),
          end: dayjs(appointment.stopTime).toISOString(),
          // Bạn có thể map kiểu dữ liệu extendedProps hoặc custom hóa tùy nhu cầu FE
        }));
      }
    );
  }
}
