import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import ListAppointment from '@features/lists/list-appointment/ListAppointment';

const PageTest = () => {
  const handleDateClick = (arg: DateClickArg) => {
    alert(arg.dateStr);
  };

  return <ListAppointment />;
}

export default PageTest
