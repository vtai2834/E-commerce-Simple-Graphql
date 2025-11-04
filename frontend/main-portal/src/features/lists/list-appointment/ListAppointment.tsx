import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayjs, { Dayjs } from "dayjs";
import { EventContentArg, EventClickArg } from "@fullcalendar/core";
import { Segmented, DatePicker, Button } from "antd";
import "./style.scss";
import ItemAppointment from "./ItemAppointment";
import { LeftOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import { useListAppointments } from "@hooks/physician/useListAppointments";
import { useAppSelector } from "@store/index";
import { ETypeInputListAppointment } from "@services/queries/get-appointments/get-appointments.type";
import DetailAppointmentDrawer from "@features/drawers/detail-appointment-drawer/detailAppointmentDrawer";


const ListAppointment = () => {
  const calendarRef = useRef<FullCalendar | null>(null);
  const [view, setView] = useState<string>("Date");
  const [date, setDate] = useState<Dayjs>(dayjs());
  const navigate = useNavigate();

  //drawer detail appointment:
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)

  const userId = useAppSelector((state)=> state.authenticator.user.id)

  const {data, onHandleGetAppointments} = useListAppointments()

  const viewDatePicker: ComponentProps<typeof DatePicker>["picker"] = useMemo(() => {
    return view === "Date" ? "date" : view === "Week" ? "week" : "month";
  }, [view]);

  const handleToday = () => {
    const today = dayjs();
    setDate(today);
    const api = calendarRef.current?.getApi();
    api?.today();
  };

  const handlePrev = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;

    if (view === "Date") setDate((prev) => prev.subtract(1, "day"));
    else if (view === "Week") setDate((prev) => prev.subtract(1, "week"));
    else setDate((prev) => prev.subtract(1, "month"));

    api.prev();
  };

  const handleNext = () => {
    const api = calendarRef.current?.getApi();
    if (!api) return;

    if (view === "Date") setDate((prev) => prev.add(1, "day"));
    else if (view === "Week") setDate((prev) => prev.add(1, "week"));
    else setDate((prev) => prev.add(1, "month"));

    api.next();
  };


  const handleAddAppointment = () => {
    navigate(`/mainboard/PHYSICIAN/create-new-appointment`);
  }

  //phần drawer detail appointment:
  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event

    console.log("event click trong calendar: ", event);
    console.log("event.extendedProps: ", event.extendedProps);
    console.log("appointment ID: ", event.extendedProps?.appointment?.id);

    // Transform event data to match drawer interface
    const appointmentDetail = {
      id: event.extendedProps?.appointment?.id || event.id, // Lấy ID từ extendedProps trước, fallback về event.id
      startTime: event.start?.toISOString() || "",
      endTime: event.end?.toISOString() || "",
      date: event.start?.toISOString() || "",
      type: event.extendedProps?.appointment?.type || "In-person",
      facility: event.extendedProps?.appointment?.facilityId || "Biocare DM",
      reasonForVisit: event.extendedProps?.appointment?.title || "Abdominal pain",
      status: event.extendedProps?.appointment?.status || "scheduled",
      note: event.extendedProps?.appointment?.note || 'note',

      patient: {
        name: event.extendedProps?.patient?.fullName || "Unknown",
        programId: event.extendedProps?.patient?.id || "N/A", // Sử dụng patient.id thay vì programId
        gender: event.extendedProps?.patient?.gender || "N/A",
        dob: event.extendedProps?.patient?.dob || "N/A",
        phone: event.extendedProps?.patient?.phone || "N/A",
      },
      attendees: [
        {
          id: "1",
          name: [event.extendedProps?.physician?.firstName, event.extendedProps?.physician?.lastName]
            .filter(Boolean)
            .join(' ') || 'Killiam Mbape',
          role: "Physician",
        },
      ],
    }

    setSelectedAppointment(appointmentDetail)
    setDrawerOpen(true)
  }

  useEffect(() => {
    const api = calendarRef.current?.getApi();
    if (!api) return;

    if (view === "Date") api.changeView("timeGridDay", date.toDate());
    if (view === "Week") api.changeView("timeGridWeek", date.toDate());
    if (view === "Month") api.changeView("dayGridMonth", date.toDate());

    const timer = setTimeout(() => api.updateSize(), 0);

    return () => clearTimeout(timer);
  }, [view, date]);

  useEffect(()=>{
    onHandleGetAppointments({
      physicianId: userId,
      filter: {
        type: {
          Date: ETypeInputListAppointment.daily,
          Week: ETypeInputListAppointment.weekly,
          Month: ETypeInputListAppointment.monthly
        }[view] as ETypeInputListAppointment,

        date: date.toISOString()
      }
    })
  },[userId, date, view])

  return (
    <div className="list-appointment">
      <div className="list-appointment__sidebar">
        <Segmented
          options={["Date", "Week", "Month"]}
          value={view}
          onChange={(val) => setView(val)}
        />

        <DatePicker
          picker={viewDatePicker}
          value={date}
          onChange={(d) => d && setDate(d)}
        />
      </div>

      <div className="list-appointment__calendar">
        <div className="list-appointment__calendar--toolbar">
          <div className="filter-day">
            <Button onClick={handlePrev} icon={<LeftOutlined />} />

            <Button onClick={handleToday}>Today</Button>

            <Button onClick={handleNext} icon={<RightOutlined />} />
          </div>

          <div className="add-appointment">
            <Button icon={<PlusOutlined />}  onClick={handleAddAppointment} >New</Button>
          </div>
        </div>

        <FullCalendar
          ref={calendarRef}
          allDaySlot={false}
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="timeGridDay"
          editable
          droppable
          headerToolbar={false}
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          slotDuration="00:30:00"
          slotLabelInterval="01:00"
          events={(data?.filter((event) => event !== null)) || []}
          eventContent={(arg: EventContentArg) => ItemAppointment({ event: arg.event })}
          eventClick={handleEventClick}
          height={700}
        />
      </div>

      <DetailAppointmentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onCallback={()=>onHandleGetAppointments({
          physicianId: userId,
          filter: {
            type: {
              Date: ETypeInputListAppointment.daily,
              Week: ETypeInputListAppointment.weekly,
              Month: ETypeInputListAppointment.monthly
            }[view] as ETypeInputListAppointment,
    
            date: date.toISOString()
          }
        })}
        appointment={selectedAppointment}
      />

    </div>
  );
};

export default ListAppointment;
