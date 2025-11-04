"use client"

import { Drawer, Button, Avatar, Modal, Input } from "antd"
import { toast } from "react-toastify"
import { useCancelAppointment } from "@/hooks/appointment/useCancelAppointment"
import { useCompleteAppointment } from "@/hooks/appointment/useCompleteAppointment"
import { useCallback, useMemo, useState } from "react"
import { CloseOutlined, ClockCircleOutlined, CalendarOutlined, CheckOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import "./style.scss"
import { useUpdateAppointmentNote } from "@/hooks/appointment/useUpdateAppointmentNote"

interface IAttendee {
    id: string
    name: string
    role: string
    avatar?: string
}

interface IAppointmentDetail {
    id: string
    startTime: string
    endTime: string
    date: string
    type: string
    facility: string
    reasonForVisit: string
    status: string
    note?: string
    patient: {
        name: string
        programId: string
        gender: string
        dob: string
    }
    attendees: IAttendee[]
}

interface IDetailAppointmentDrawerProps {
    open: boolean
    onClose: () => void
    appointment: IAppointmentDetail | null
    onCallback: () => Promise<string | number>
}

const DetailAppointmentDrawer = ({ open, onClose, appointment , onCallback}: IDetailAppointmentDrawerProps) => {
    const { onCancelAppointment, loading: cancelling } = useCancelAppointment()
    const { onCompleteAppointment, loading: completing } = useCompleteAppointment()
    const { onUpdateAppointmentNote, loading: updating } = useUpdateAppointmentNote()

    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false)
    const [isEditingNote, setIsEditingNote] = useState(false)
    const [noteValue, setNoteValue] = useState<string>("")

    const initialNote = useMemo(() => appointment?.note || "", [appointment?.note])

    const handleCancel = useCallback(async () => {
        if (!appointment?.id) return
        try {
            const res = await onCancelAppointment({ appointmentId: appointment.id })
            if (res?.isSuccess) {
                toast.success("Cancel appointment successfully")
                onClose()
                if (onCallback) {
                    onCallback()
                }
            } else {
                toast.error("Cancel appointment failed")
            }
        } catch {
            toast.error("Cancel appointment failed")
        }
    }, [appointment?.id, onCancelAppointment, onClose])

    const handleComplete = useCallback(async () => {
        if (!appointment?.id) return
        try {
            const res = await onCompleteAppointment({ appointmentId: appointment.id })
            if (res?.isSuccess) {
                toast.success("Complete appointment successfully")
                onClose()
                if (onCallback) {
                    onCallback()
                }
            } else {
                toast.error("Complete appointment failed")
            }
        } catch {
            toast.error("Complete appointment failed")
        }
    }, [appointment?.id, onCompleteAppointment, onClose])

    const openNoteModal = useCallback(() => {
        setNoteValue(initialNote)
        setIsEditingNote(false)
        setIsNoteModalOpen(true)
    }, [initialNote])

    const closeNoteModal = useCallback(() => {
        setIsNoteModalOpen(false)
        setIsEditingNote(false)
        setNoteValue(initialNote)
    }, [initialNote])

    const handleSaveNote = useCallback(async () => {
        if (!appointment?.id) return
        try {
            const res = await onUpdateAppointmentNote({ appointmentId: appointment.id, note: noteValue })
            if (res?.isSuccess) {
                toast.success("Update note successfully")
                setIsEditingNote(false)
                if (onCallback) {
                    onCallback()
                }
                setIsNoteModalOpen(false)
            } else {
                toast.error("Update note failed")
            }
        } catch {
            toast.error("Update note failed")
        }
    }, [appointment?.id, noteValue, onUpdateAppointmentNote, onCallback])
    
    if (!appointment) return null

    const duration = dayjs(appointment.endTime).diff(dayjs(appointment.startTime), "minute")

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
    }

    const isActionEnabled = appointment.status === 'SCHEDULED';

    return (
        <Drawer open={open} onClose={onClose} width={600} closable={false} className="detail-appointment-drawer">
            <div className="drawer-header">
                <h2><strong>Appointment Information</strong></h2>
                <Button type="text" icon={<CloseOutlined />} onClick={onClose} className="close-btn" />
            </div>

            <div className="drawer-content">

                <div className="action-container">

                    <div className="header-appointment">
                        <div className="time-section">
                            <div className="time-info">
                                <span className="time-text">
                                    {dayjs(appointment.startTime).format("h:mm A")} - {dayjs(appointment.endTime).format("h:mm A")} (
                                    {duration} mins)
                                </span>
                            </div>
                            <div className="date-info">
                                <CalendarOutlined />
                                <span className="date-text">{dayjs(appointment.date).format("ddd MM/DD/YYYY")}</span>
                            </div>
                        </div>

                        <div className="status-buttons">
                            <Button danger className="cancel-btn" loading={cancelling} onClick={handleCancel} disabled={!isActionEnabled}>
                                Cancel
                            </Button>
                            <Button className="overdue-btn" icon={<ClockCircleOutlined />} onClick={openNoteModal}>Note</Button>
                            <Button className="done-btn" icon={<CheckOutlined />} loading={completing} onClick={handleComplete} disabled={!isActionEnabled}>Done</Button>
                        </div>
                    </div>

                    <button type="button" className="details-link">
                        Go to appointment details →
                    </button>
                </div>

                <div className="info-section">
                    <h3>Appointment information</h3>
                    <div className="info-row">
                        <span className="label">Type</span>
                        <span className="value in-person">{appointment.type}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Facility</span>
                        <span className="value">{appointment.facility}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Reason for visit</span>
                        <span className="value">{appointment.reasonForVisit}</span>
                    </div>
                </div>

                <div className="info-section">
                    <h3>Patient information</h3>
                    <div className="info-row">
                        <span className="label">Name</span>
                        <span className="value">{appointment.patient.name}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Program ID</span>
                        <span className="value">{appointment.patient.programId}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Gender</span>
                        <span className="value">{appointment.patient.gender}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">DOB</span>
                        <span className="value">{appointment.patient.dob}</span>
                    </div>
                </div>

                <div className="info-section">
                    <h3>Attendees</h3>
                    <div className="attendees-list">
                        {appointment.attendees.map((attendee) => (
                            <div key={attendee.id} className="attendee-item">
                                <Avatar
                                    size={40}
                                    style={{
                                        backgroundColor: attendee.role === "Nurse" ? "#FFC107" : "#E0E0E0",
                                    }}
                                >
                                    {getInitials(attendee.name)}
                                </Avatar>
                                <div className="attendee-info">
                                    <div className="attendee-name">{attendee.name}</div>
                                    <div className="attendee-role">{attendee.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Modal
                open={isNoteModalOpen}
                onCancel={closeNoteModal}
                title="Appointment Note"
                footer={[
                    !isEditingNote ? (
                        <Button key="edit" type="primary" onClick={() => setIsEditingNote(true)}>
                            Edit
                        </Button>
                    ) : (
                        <>
                            <Button key="cancel" onClick={() => { setIsEditingNote(false); setNoteValue(initialNote); }}>
                                Cancel
                            </Button>
                            <Button key="save" type="primary" loading={updating} disabled={noteValue === initialNote} onClick={handleSaveNote}>
                                Save
                            </Button>
                        </>
                    )
                ]}
            >
                {!isEditingNote ? (
                    <div style={{ whiteSpace: 'pre-wrap' }}>{initialNote || 'No note'}</div>
                ) : (
                    <Input.TextArea
                        value={noteValue}
                        onChange={(e) => setNoteValue(e.target.value)}
                        autoSize={{ minRows: 4, maxRows: 8 }}
                        placeholder="Enter note"
                    />
                )}
            </Modal>
        </Drawer>
    )
}

export default DetailAppointmentDrawer
