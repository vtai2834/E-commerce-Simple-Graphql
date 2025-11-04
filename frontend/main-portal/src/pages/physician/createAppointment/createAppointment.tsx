
import { useEffect, useMemo, useState } from "react"
import { Form, Select, Radio, Input, DatePicker, TimePicker, Button, Tag, Avatar, Typography } from "antd"
import { CloseOutlined, SearchOutlined, ArrowLeftOutlined } from "@ant-design/icons"
import PatientSearchModal from "./patientModal/patientModal"
import "./style.scss"
import { useSelector } from "react-redux"
import type { RootState } from "@store/index"
import { useListFacilities } from "@hooks/facilities/useGetFacilities"
import { useListPhysiciansValidWorkingHour } from "@hooks/physician/useListPhysicianValidWH"
import { useCreateAppointment } from "@hooks/appointment/useCreateAppointment"
import { usePatientDetail } from "@hooks/patient/usePatientDetail"
import { useNavigate } from "react-router-dom"


const { Option } = Select
const { Title } = Typography;

const CreateAppointment = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm()
  const [selectedFacility, setSelectedFacility] = useState("biocare-dm")
  const [patientType, setPatientType] = useState("with-program")
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [appointmentType, setAppointmentType] = useState("IN_PERSON")
  // const [isRecurring, setIsRecurring] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  
  // Form values for physician validation
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedDuration, setSelectedDuration] = useState<number>(0)

  const userFacilities = useSelector((state: RootState) => state.authenticator.user.facilities || [])
  const memoIds = useMemo(() => userFacilities, [userFacilities.join(',')])
  const { data: facilitiesData } = useListFacilities(memoIds)

  const facilities = facilitiesData || [];

  // Fetch valid physicians based on date, time, duration
  const { data: validPhysiciansData, loading: physiciansLoading } = useListPhysiciansValidWorkingHour(
    selectedFacility,
    selectedDate,
    selectedTime,
    selectedDuration
  );
  
  const physicians = validPhysiciansData?.data || [];

  // Create appointment hook
  const { onCreateAppointment, loading: createLoading } = useCreateAppointment();

  // Patient detail hook to fetch carePlanId
  const { onFetchPatientDetail, data: patientDetailData } = usePatientDetail();

  useEffect(() => {
    if (facilities && facilities?.length) {
      const firstId = facilities[0]?.id;
      form.setFieldsValue({ facility: firstId });
      setSelectedFacility(firstId || '');
    }
  }, [facilitiesData, form]);

  // Reset physician selection when facility changes
  useEffect(() => {
    form.setFieldValue("physician", undefined);
  }, [selectedFacility, form]);

  const handlePatientSelect = async (patient: any) => {
    setSelectedPatient(patient)
    form.setFieldValue("patient", patient.id)
    setIsModalVisible(false)
    
    // Fetch patient detail to get carePlanId
    try {
      await onFetchPatientDetail({ getPatientDetailsId: patient.id });
    } catch (error) {
      console.error("Failed to fetch patient detail:", error);
    }
  }

  const handleRemovePatient = () => {
    setSelectedPatient(null)
    form.setFieldValue("patient", undefined)
    // Clear patient detail data when removing patient
  }

  const handleSearchClick = () => {
    setIsModalVisible(true)
  }

  const handleDateChange = (date: any, dateString: string | string[]) => {
    setSelectedDate(Array.isArray(dateString) ? dateString[0] : dateString)
    // Reset physician selection when date changes
    form.setFieldValue("physician", undefined)
  }

  const handleTimeChange = (time: any, timeString: string | string[]) => {
    const timeStr = Array.isArray(timeString) ? timeString[0] : timeString
    // Convert from 12h format (3:00 PM) to 24h format (15:00)
    if (time && timeStr) {
      const hour = time.hour()
      const minute = time.minute()
      const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      setSelectedTime(formattedTime)
    } else {
      setSelectedTime("")
    }
    // Reset physician selection when time changes
    form.setFieldValue("physician", undefined)
  }

  const handleDurationChange = (duration: number) => {
    setSelectedDuration(duration)
    // Reset physician selection when duration changes
    form.setFieldValue("physician", undefined)
  }

  const handleSubmit = async (values: any) => {
    try {
      // Convert date to proper format and combine with time
      const dateObj = new Date(values.date);
      const [hours, minutes] = selectedTime.split(':');
      dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      const isoDateTime = dateObj.toISOString();
      
      console.log("[v0] Final datetime:", isoDateTime);
      
      // Get carePlanId from patient detail data
      const carePlanId = patientDetailData?.patient?.carePlanId || null;
      
      console.log("Patient detail data:", patientDetailData);
      console.log("CarePlanId:", carePlanId);
      
      const appointmentData = {
        input: {
          type: values.appointmentType?.toUpperCase() || 'IN_PERSON',
          patientId: values.patient,
          physicianId: values.physician,
          facilityId: values.facility,
          note: 'New Appointment',
          startTime: isoDateTime,
          duration: values.duration,
          carePlanId: carePlanId,
          title: values.reason || 'Appointment',
        }
      };

      console.log("dữ liệu gửi đi để create appointment: ", appointmentData);

      const result = await onCreateAppointment(appointmentData);
      console.log("Appointment created successfully:", result);
      
      // Reset form after successful creation
      form.resetFields();
      setSelectedPatient(null);
      setSelectedDate("");
      setSelectedTime("");
      setSelectedDuration(0);
      
    } catch (error) {
      console.error("Failed to create appointment:", error);
    }
  }

  return (
    <div className="createAppointment">
      {/* Simple Header Bar with Back Button */}
      <div className="page-back-bar">
        {/* chỗ này đặt logic trong onClick luôn có sao kh zậy ??__?? */}
        <ArrowLeftOutlined className="back-icon" onClick={() => navigate(-1)} />
        <Title level={5} className="page-back-title">Create Appointment</Title>
      </div>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Patient Information Section */}
        <div className="appointmentSection">
          <h2 className="sectionTitle">Patient information</h2>

          <Form.Item
            name="facility"
            label={<span className="formLabel">Facility</span>}
            rules={[{ required: true, message: "Please select a facility" }]}
            initialValue={facilitiesData ? facilitiesData[0]?.name : selectedFacility}
          >
            <Select onChange={setSelectedFacility} className="formSelect" placeholder="Select ...">
              {(facilities || []).map((facility) => (
                facility ? (
                  <Option key={facility.id} value={facility.id}>
                    {facility.name}
                  </Option>
                ) : null
              ))}
            </Select>
          </Form.Item>

          {selectedFacility && (
            <div className="facilityInfo">
              <span className="facilityName">{(facilities || []).filter(Boolean).find((f) => (f !== null && f.id === selectedFacility))?.name}</span>
              <br />
              <span className="facilityAddress">
                {(facilities || []).filter(Boolean).find((f) => (f !== null && f.id === selectedFacility))?.contactInfo?.address}
              </span>
              <CloseOutlined className="facilityClose" onClick={() => setSelectedFacility("")} />
            </div>
          )}

          {/* <Form.Item
            name="patientType"
            label={<span className="formLabel">Patient</span>}
            initialValue={patientType}
          >
            <Radio.Group onChange={(e) => setPatientType(e.target.value)} className="patientTypeGroup">
              <Radio.Button value="with-program" className="patientTypeButton">
                Patient with program
              </Radio.Button>
              <Radio.Button value="other" className="patientTypeButton">
                Other patients
              </Radio.Button>
            </Radio.Group>
          </Form.Item>

          <p className="helperText">Schedule an appointment for a patient who is on a program.</p> */}

          <Form.Item
            name="patient"
            label={<span className="formLabel">Search for patient</span>}
            rules={[{ required: true, message: "Please select a patient" }]}
          >
            <Input
              placeholder="Search for patient's name or email"
              suffix={<SearchOutlined />}
              className="searchInput"
              onClick={handleSearchClick}
              readOnly
              value={selectedPatient ? selectedPatient.name : ""}
            />
          </Form.Item>

          {selectedPatient && (
            <>
              <div className="patientCard">
                <Avatar className="patientAvatar" style={{ backgroundColor: "#ff9966" }}>
                  {selectedPatient.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </Avatar>
                <div className="patientInfo">
                  <div className="patientHeader">
                    <span className="patientName">{selectedPatient.name}</span>
                    <Tag color="blue" className="patientTag">
                      CCM
                    </Tag>
                    <Tag color="blue" className="patientTag">
                      RPM
                    </Tag>
                  </div>
                  <div className="patientEmail">
                    {selectedPatient.email} | Program {selectedPatient.program}
                  </div>
                </div>
                <CloseOutlined className="patientClose" onClick={handleRemovePatient} />
              </div>

              <div className="patientDetails">
                <div className="detailRow">
                  <span className="detailLabel">Name</span>
                  <span className="detailValue">{selectedPatient.name}</span>
                </div>
                <div className="detailRow">
                  <span className="detailLabel">Gender</span>
                  <span className="detailValue">{selectedPatient.gender}</span>
                </div>
                <div className="detailRow">
                  <span className="detailLabel">DOB</span>
                  <span className="detailValue">
                    {selectedPatient.dob} ({selectedPatient.age})
                  </span>
                </div>
                <div className="detailRow">
                  <span className="detailLabel">Phone</span>
                  <span className="detailValue">{selectedPatient.phone}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Appointment Info Section */}
        <div className="appointmentSection">
          <h2 className="sectionTitle">Appointment Info</h2>

          {/* <Form.Item
            name="appointmentType"
            label={<span className="formLabel">Appointment type</span>}
            initialValue={appointmentType}
          >
            <Radio.Group onChange={(e) => setAppointmentType(e.target.value)} className="appointmentTypeGroup">
              <Radio.Button value="virtual" className="appointmentTypeButton">
                Virtual
              </Radio.Button>
              <Radio.Button value="IN_PERSON" className="appointmentTypeButton">
                In-person
              </Radio.Button>
            </Radio.Group>
          </Form.Item> */}


          <div className="formGroup" id="date-time-group">
            <label className="formLabel" htmlFor="date-time-group">Date and time</label>
            <div className="dateTimeRow">
              <div className="dateField">
                <label className="fieldLabel" htmlFor="date">Date</label>
                <Form.Item
                  name="date"
                  rules={[{ required: true, message: "Please select a date" }]}
                  style={{ marginBottom: 0 }}
                >
                  <DatePicker 
                    id="date" 
                    placeholder="YYYY/MM/DD" 
                    format="YYYY/MM/DD" 
                    className="datePicker"
                    onChange={handleDateChange}
                  />
                </Form.Item>
              </div>
              <div className="timeField">
                <label className="fieldLabel" htmlFor="time">Time</label>
                <Form.Item
                  name="time"
                  rules={[{ required: true, message: "Please select a time" }]}
                  style={{ marginBottom: 0 }}
                >
                  <TimePicker 
                    id="time" 
                    use12Hours 
                    format="h:mm A" 
                    placeholder="Select time" 
                    className="timePicker"
                    onChange={handleTimeChange}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          <Form.Item
            name="duration"
            label={<span className="formLabel">Duration (min)</span>}
            rules={[{ required: true, message: "Please select a duration" }]}
          >
            <Select 
              placeholder="Select a duration" 
              className="formSelect"
              onChange={handleDurationChange}
            >
              <Option value={15}>15 minutes</Option>
              <Option value={30}>30 minutes</Option>
              <Option value={45}>45 minutes</Option>
              <Option value={60}>60 minutes</Option>
            </Select>
          </Form.Item>

          {/* <Form.Item name="isRecurring" valuePropName="checked" initialValue={false}>
            <Checkbox onChange={(e) => setIsRecurring(e.target.checked)}>Recurring appointment</Checkbox>
          </Form.Item> */}

          <div className="formGroup" id="attendees-group">
            <label className="formLabel" htmlFor="attendees-group">Attendee(s)</label>

            <div className="attendeeField">
              <label className="fieldLabel" htmlFor="physician">Physician</label>
              <Form.Item name="physician" style={{ marginBottom: 0 }}>
                <Select
                  id="physician"
                  placeholder="Select a physician"
                  className="formSelect"
                  loading={physiciansLoading}
                  disabled={physiciansLoading || !selectedFacility || !selectedDate || !selectedTime || !selectedDuration}
                  notFoundContent={
                    physiciansLoading 
                      ? "Loading..." 
                      : !selectedDate || !selectedTime || !selectedDuration
                        ? "Please select date, time, and duration first"
                        : "No available physicians for this time slot"
                  }
                >
                  {(physicians || []).map((p) => (
                    <Option key={p?.id} value={p?.id}>
                      {p?.fullName || (p?.firstName && p?.lastName ? `${p.firstName} ${p.lastName}` : p?.id)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>

          <Form.Item
            name="reason"
            label={<span className="formLabel">Reason for visit</span>}
            rules={[
              { required: true, message: "Please enter a reason" },
              { max: 200, message: "Reason must be at most 200 characters" },
            ]}
          >
            <Input.TextArea
              placeholder="Enter reason for visit"
              className="formInput"
              showCount
              maxLength={200}
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Form.Item>

          <div className="formActions">
            {/* <Button className="btnSecondary">Previous step</Button> */}
            <Button 
              type="primary" 
              htmlType="submit" 
              className="btnPrimary"
              loading={createLoading}
            >
              {createLoading ? "Creating..." : "Create Appointment"}
            </Button>
          </div>
        </div>
      </Form>

      <PatientSearchModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelect={handlePatientSelect}
        facilityId={selectedFacility}
      />
    </div>
  )
}

export default CreateAppointment
