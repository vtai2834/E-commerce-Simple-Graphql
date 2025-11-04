import { EventContentArg } from "@fullcalendar/core/index.js";
import dayjs from "dayjs";

import "./style.scss";
import { EAppointmentStatus } from "@services/queries/get-appointments/get-appointments.type";

interface IItemAppointmentProps {
  event: EventContentArg["event"];
}

const ItemAppointment = ({ event }: IItemAppointmentProps) => {
  const now = dayjs();
  const isCurrent =
    dayjs(event.start).isBefore(now) && dayjs(event.end).isAfter(now);

  const statusAppointment = {
    [EAppointmentStatus.SCHEDULED]: "Scheduled",
    [EAppointmentStatus.COMPLETED]: "Completed",
    [EAppointmentStatus.CANCELLED]: "Cancelled"
  }[event.extendedProps.appointment.status as EAppointmentStatus]

  return (
    <div className={`item-appointment ${isCurrent ? "current" : ""} ${statusAppointment?.toLowerCase()}`}>
      <h1>{event.title}</h1>

      <span className="appointment-time">
        {dayjs(event.start?.toISOString()).format("hh:mm A")}
      </span>

      <span className="appointment-patient">
        {event.extendedProps.patient?.fullName}
      </span>

      <span className= {`appointment-status ` + `${statusAppointment?.toLowerCase()}`}>
        {statusAppointment}
      </span>
    </div>
  );
};

export default ItemAppointment;
