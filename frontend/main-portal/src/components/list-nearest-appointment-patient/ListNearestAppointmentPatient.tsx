import type React from "react"
import { useEffect, useMemo } from "react"
import { Card, Spin, Typography, Tag, Empty, Calendar, Badge, Row, Col, Divider, Space } from "antd"
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
} from "@ant-design/icons"
// import type { IParseDataNearestAppointment } from "@/types/appointment"
// import { EAppointmentStatus } from "@/types/appointment"
import { useGetNearestAppointment } from "@/hooks/appointment/useGetNearestAppointment"
import dayjs, { type Dayjs } from "dayjs"
import "dayjs/locale/vi"
import "./ListNearestAppointmentPatient.scss"
import { IParseDataNearestAppointment } from "@/services/queries/get-nearest-appointments/get-nearest-appointments.type"
import { EAppointmentStatus } from "@/services/queries/get-appointments/get-appointments.type"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { useSocket } from "@/contexts/SocketContext"

dayjs.locale("en")

const { Title, Text } = Typography

const statusConfig: Record<EAppointmentStatus, { color: string; text: string }> = {
  [EAppointmentStatus.SCHEDULED]: { color: "blue", text: "Scheduled" },
  [EAppointmentStatus.COMPLETED]: { color: "green", text: "Completed" },
  [EAppointmentStatus.CANCELLED]: { color: "red", text: "Cancelled" },
  // [EAppointmentStatus.NO_SHOW]: { color: "orange", text: "Vắng mặt" },
}

const ListNearestAppointmentPatient: React.FC = () => {
  const patientId = useSelector((state : RootState) => state.authenticator?.user?.id);
  const { data, loading, error, getNearestAppointment } = useGetNearestAppointment()
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    if (patientId) {
      getNearestAppointment({ patientId })
    }
  }, [patientId])

  // Subscribe to socket event: appointment_updated -> refetch nearest appointments
  useEffect(() => {
    if (!socket || !isConnected || !patientId) return

    // type AppointmentUpdatedPayload = { patientId?: string }
    const handler = () => {
      // Only refetch if event relates to this patient
      if (!patientId) return
      getNearestAppointment({ patientId })
    }

    socket.on('appointment_updated', handler)
    return () => {
      socket.off('appointment_updated', handler)
    }
  }, [socket, isConnected, patientId, getNearestAppointment])

  const appointmentDates = useMemo(() => {
    if (!data) return new Set<string>()
    return new Set(data.map((item) => dayjs(item.startTime).format("YYYY-MM-DD")))
  }, [data])

  const dateCellRender = (value: Dayjs) => {
    const dateStr = value.format("YYYY-MM-DD")
    if (appointmentDates.has(dateStr)) {
      return <Badge status="processing" />
    }
    return null
  }

  const renderAppointmentCard = (item: IParseDataNearestAppointment, index: number) => {
    const isNearest = index === 0
    const startTime = dayjs(item.startTime)
    const statusInfo = statusConfig[item.status] || { color: "default", text: item.status }

    return (
      <Card key={item.id} className={`appointment-card ${isNearest ? "nearest-appointment" : ""}`} hoverable>
        {isNearest && (
          <div className="nearest-badge">
            <Tag color="gold" icon={<ClockCircleOutlined />}>
              Nearest
            </Tag>
          </div>
        )}

        <div className="appointment-header">
          <Title level={5} className="appointment-title">
            <MedicineBoxOutlined /> {item.title}
          </Title>
          <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
        </div>

        <Divider className="appointment-divider" />

        <Space direction="vertical" size="middle" className="appointment-details">
          <div className="detail-row">
            <CalendarOutlined className="detail-icon" />
            <div className="detail-content">
              <Text strong>Appointment Time</Text>
              <Text className="detail-value">{startTime.format("dddd, DD/MM/YYYY")}</Text>
              <Text className="detail-time">
                {startTime.format("HH:mm")} - {dayjs(item.stopTime).format("HH:mm")}
              </Text>
            </div>
          </div>

          <div className="detail-row">
            <UserOutlined className="detail-icon" />
            <div className="detail-content">
              <Text strong>Physician</Text>
              <Text className="detail-value">
                Dr. {item.physician?.firstName} {item.physician?.lastName}
              </Text>
            </div>
          </div>

          <div className="detail-row">
            <EnvironmentOutlined className="detail-icon" />
            <div className="detail-content">
              <Text strong>Facility</Text>
              <Text className="detail-value">{item.facility?.name || "Unknown"}</Text>
            </div>
          </div>

          {item.note && (
            <div className="detail-row">
              <div className="detail-content note-content">
                <Text strong>Note</Text>
                <Text className="detail-value note-text">{item.note}</Text>
              </div>
            </div>
          )}
        </Space>
      </Card>
    )
  }

  return (
    <div className="nearest-appointment-container">
      <Card className="page-header-card" bordered={false}>
        <Title level={3} className="page-title">
          <CalendarOutlined /> Upcoming Appointments
        </Title>
        <Text type="secondary">Manage and track your healthcare appointments</Text>
      </Card>

      {loading ? (
        <div className="centered-content">
          <Spin size="large" tip="Loading..." />
        </div>
      ) : error ? (
        <Card className="error-card">
          <Empty description={<Text type="danger">Failed to load data!</Text>} />
        </Card>
      ) : !data || data.length === 0 ? (
        <Card className="empty-card">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="You have no upcoming appointments" />
        </Card>
      ) : (
        <Row gutter={[24, 24]} className="content-row">
          <Col xs={24} lg={10} xl={8}>
            <Card className="calendar-card" title="Month Calendar">
              <Calendar fullscreen={false} cellRender={dateCellRender} />
            </Card>
          </Col>

          <Col xs={24} lg={14} xl={16}>
            <div className="appointments-list">
              <Title level={4} className="list-title">
                Appointments List ({data.length})
              </Title>
              <Space direction="vertical" size="large" className="appointments-space">
                {data.map((item, index) => renderAppointmentCard(item, index))}
              </Space>
            </div>
          </Col>
        </Row>
      )}
    </div>
  )
}

export default ListNearestAppointmentPatient
