import { ApolloClient } from "@apollo/client";
import { GraphqlCaller } from "@services/graph-caller";
import { LIST_APPOINTMENTS_QUERY } from "./get-appointments.query";
import { IGetListAppointmentsInput, IGetListAppointmentsResponse, IParaseDataListAppointments } from "./get-appointments.type";
import dayjs from "dayjs";


export class ListAppointmentsApi extends GraphqlCaller<
  IParaseDataListAppointments,
  IGetListAppointmentsInput,
  IGetListAppointmentsResponse
> {
  constructor(client: ApolloClient) {
    super(
      client,
      LIST_APPOINTMENTS_QUERY,
      (raw) => {
        return raw.getAppointments.map((appointment) => {
          return {
            title: appointment.title,
            start: dayjs(appointment.startTime).toISOString(),
            end: dayjs(appointment.stopTime).toISOString(),

            extendedProps: {
              appointment: {
                id: appointment.id,
                status: appointment.status,

                type: appointment.type,
                physicianId: appointment.physicianId,
                facilityId: appointment.facilityId,
                note: appointment.note,
                startTime: appointment.startTime,
                stopTime: appointment.stopTime,
                duration: appointment.duration,
                carePlanId: appointment.carePlanId,
                title: appointment.title,
              },
              physician: {
                firstName: appointment.physician.firstName,
                lastName: appointment.physician.lastName,
              },
              patient: {
                id: appointment.patient.id,
                fullName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
                phone: appointment.patient.contactInfo.phone,
                duration: appointment.duration,
                dob: appointment.patient.dob,
                contactInfo: {
                  address: appointment.patient.contactInfo.address,
                  city: appointment.patient.contactInfo.city,
                  state: appointment.patient.contactInfo.state,
                  country: appointment.patient.contactInfo.country,
                  phone: appointment.patient.contactInfo.phone,
                }
              }
            }
          }
        })
      }
    );
  }
}
