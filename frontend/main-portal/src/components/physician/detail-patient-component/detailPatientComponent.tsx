import type React from "react"
import { useEffect, useState } from "react"
import { Button, Avatar, Typography, Space, Modal, message, Descriptions, Input } from "antd"

import {  FileTextOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons"
import "./style.scss"

import { useStopCarePlan } from "@hooks/care-plan/useStopCarePlan"
// Notes modal is implemented inline to support view + edit in one place
import { useUpdateCarePlanNote } from "@hooks/care-plan/useUpdateCarePlanNote"

import { useSocket } from "src/contexts/SocketContext"
import { SOCKET_EVENTS_CLIENT_TO_SERVER, TestEventData } from "src/types/socket"

import { useNavigate } from "react-router-dom"



const { Title, Text } = Typography

interface PatientInfoProps {
    patientData?: {
        id?: string
        name?: string
        gender?: string
        age?: string
        email?: string
        programId?: string
        address?: string
        city?: string
        country?: string
        phone?: string
        state?: string
        notes?: string
    }
    carePlanId?: string
}

const PatientInfoComponent: React.FC<PatientInfoProps> = ({
    patientData, carePlanId
}) => {
    const [isNotesModalVisible, setIsNotesModalVisible] = useState(false)
    const [isEditingNote, setIsEditingNote] = useState(false)
    const [noteInput, setNoteInput] = useState<string>(patientData?.notes || "")
    const [updatingNote, setUpdatingNote] = useState(false)
    const [isPatientInfoModalVisible, setIsPatientInfoModalVisible] = useState(false)
    const { onHandleStopCarePlan } = useStopCarePlan()
    const { onHandleUpdateCarePlanNote } = useUpdateCarePlanNote()
    const navigate = useNavigate();
    const { socket, isConnected } = useSocket();

    // Listen for test response from server
    useEffect(() => {
        if (socket) {
            const handleTestResponse = (data: TestEventData) => {
                console.log('📨 Received test response from server:', data);
                alert(`Server response: ${data.message}`);
            };

            socket.on(SOCKET_EVENTS_CLIENT_TO_SERVER.TEST_EVENT, handleTestResponse);

            return () => {
                socket.off(SOCKET_EVENTS_CLIENT_TO_SERVER.TEST_EVENT, handleTestResponse);
            };
        }
    }, [socket]);

    if (!patientData) {
        console.log("kh có patient data")
        return null
    }

    const handleViewPatientInfo = () => {
        setIsPatientInfoModalVisible(true);
    }

    const handleViewProgramInfo = () => {
        console.log("View program info clicked")
    }

    const handleStopProgram = async () => {
        if (!carePlanId) {
            message.error("Care Plan ID not found");
            return;
        }

        try {
            const res = await onHandleStopCarePlan({ carePlanFriendlyId: parseInt(carePlanId) });
            if (res?.id)
                message.success("Care Plan stopped successfully!");
            else message.error("Error when stop care plan");
        } catch (error) {
            message.error("Failed to stop Care Plan");
            console.error("Stop Care Plan error:", error);
        }
    }

    const handleNotesClick = () => {
        setNoteInput(patientData?.notes || "")
        setIsEditingNote(false)
        setIsNotesModalVisible(true)
    }

    const handleSaveNotes = async () => {
        if (!carePlanId) {
            message.error("Care Plan ID not found")
            return
        }
        try {
            setUpdatingNote(true)
            const res = await onHandleUpdateCarePlanNote({
                carePlanFriendlyId: parseInt(carePlanId),
                newNote: noteInput || ""
            })
            if (res?.isSuccess) {
                message.success("Updated note successfully")
                setIsEditingNote(false)
                patientData.notes = noteInput;
            } else {
                message.error("Failed to update note")
            }
        } catch (err) {
            message.error("Failed to update note")
            console.error(err)
        } finally {
            setUpdatingNote(false)
        }
    }

    // Handle test button click
    const handleTestSocket = () => {
        if (!socket || !isConnected) {
            alert('Socket not connected!');
            return;
        }

        const testData: TestEventData = {
            message: 'Hello server',
            timestamp: new Date().toISOString()
        };

        console.log('📤 Sending test event to server:', testData);
        socket.emit(SOCKET_EVENTS_CLIENT_TO_SERVER.TEST_EVENT, testData);
    };
  
    const handleClickAddApppointment = () => {
        navigate(`/mainboard/PHYSICIAN/create-new-appointment`);
    }


    return (
        <div className="patient-info-container">
            {/* Patient Info Card */}
            <div className="patient-info-card">
                <div className="patient-basic-info">
                    <Avatar size={48} src="https://ca.slack-edge.com/T09ERD5AQAC-U09DW6TRPL3-a6ca13c11847-512" className="patient-avatar" />
                    <div className="patient-details">
                        <Title level={5} className="patient-name">
                            {patientData.name}
                        </Title>
                        <Space className="patient-meta">
                            <Text className="patient-gender">
                                <UserOutlined style={{ fontSize: '14px' }} /> {patientData.gender} - {patientData.age}
                            </Text>
                            {/* <Text className="patient-age">- {patientData.age}</Text> */}
                            <Text className="patient-email">✉️ {patientData.email}</Text>
                            <Button type="link" className="view-patient-link" onClick={handleViewPatientInfo}>
                                View patient info
                            </Button>
                        </Space>
                    </div>
                </div>

                {/* Socket Test Button */}
                {/* <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #d9d9d9', borderRadius: '6px' }}>
                    <p><strong>Socket Test:</strong> {isConnected ? '✅ Connected' : '❌ Disconnected'}</p>
                    <Button
                        type="primary"
                        onClick={handleTestSocket}
                        disabled={!isConnected}
                    >
                        Test Socket Connection
                    </Button>
                </div> */}

                {/* Notes Modal */}
                {/* Notes Modal: view + edit in one */}
                <Modal
                    title="Notes"
                    open={isNotesModalVisible}
                    onCancel={() => setIsNotesModalVisible(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setIsNotesModalVisible(false)}>
                            Close
                        </Button>,
                        !isEditingNote ? (
                            <Button key="edit" type="primary" onClick={() => setIsEditingNote(true)}>
                                Edit
                            </Button>
                        ) : (
                            <Button key="save" type="primary" loading={updatingNote} onClick={handleSaveNotes}>
                                Save
                            </Button>
                        ),
                    ]}
                    width={600}
                >
                    {isEditingNote ? (
                        <Input.TextArea
                            rows={6}
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            placeholder="Enter notes"
                        />
                    ) : (
                        <Typography.Paragraph>
                            {patientData.notes || "No notes available"}
                        </Typography.Paragraph>
                    )}
                </Modal>

                {/* Patient Info Modal */}
                <Modal
                    title="Patient Information"
                    open={isPatientInfoModalVisible}
                    onOk={() => setIsPatientInfoModalVisible(false)}
                    onCancel={() => setIsPatientInfoModalVisible(false)}
                    width={600}
                >
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="ID">{patientData.id || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Name">{patientData.name || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Gender">{patientData.gender || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Age">{patientData.age || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Email">{patientData.email || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Phone">{patientData.phone || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Address">{patientData.address || "-"}</Descriptions.Item>
                        <Descriptions.Item label="City">{patientData.city || "-"}</Descriptions.Item>
                        <Descriptions.Item label="State">{patientData.state || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Country">{patientData.country || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Program ID">{patientData.programId || "-"}</Descriptions.Item>
                        <Descriptions.Item label="Notes">{patientData.notes || "-"}</Descriptions.Item>
                    </Descriptions>
                </Modal>

                <div className="patient-program-info">
                    <div className="program-details">
                        <Text className="program-label">RPM - {patientData.programId}</Text>
                        <Button type="link" className="view-program-link" onClick={handleViewProgramInfo}>
                            View program info
                        </Button>
                    </div>
                    <Space className="action-buttons">
                        <Button type="text" icon={<FileTextOutlined />} onClick={handleNotesClick} className="notes-button">
                            Notes
                        </Button>
                        <Button type="text" icon={<PlusOutlined />} onClick={handleClickAddApppointment} className="notes-button">
                            Appointment
                        </Button>
                        <Button danger className="stop-program-button" onClick={handleStopProgram}>
                            Stop program
                        </Button>
                    </Space>
                </div>
            </div>
        </div>
    )
}

export default PatientInfoComponent
