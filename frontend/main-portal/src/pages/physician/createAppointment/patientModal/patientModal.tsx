"use client"

import { useState } from "react"
import { Modal, Input, List, Avatar, Tag } from "antd"
import { SearchOutlined } from "@ant-design/icons"
import "./style.scss"
import { useListPatients } from "@hooks/patient/useGetListPatients"

interface Patient {
  id: string
  name: string
  email: string
  program: string
  gender: string
  dob: string
  age: number
  phone: string
  tags: string[]
}

interface PatientModalProps {
  visible: boolean
  onClose: () => void
  onSelect: (patient: Patient) => void
  facilityId: string
}

function calculateAge(dob: string) {
  if (!dob) return 0;
  const dobParts = dob.split('/');
  if (dobParts.length !== 3) return 0; // Handle invalid dob format
  const dobDate = new Date(
    parseInt(dobParts[2], 10), // Year
    parseInt(dobParts[0], 10) - 1, // Month (0-indexed)
    parseInt(dobParts[1], 10) // Day
  );
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const m = today.getMonth() - dobDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
    age--;
  }
  return age;
}

const PatientModal = ({ visible, onClose, onSelect, facilityId }: PatientModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data } = useListPatients(facilityId)

  console.log("data lấy list patient: ", data?.data);
  const fetchedPatients = data?.data || [];

  const patients_list: Patient[] = fetchedPatients.map(apiPatient => ({

    id: apiPatient.id, // Keep as string, don't convert to number
    name: `${apiPatient.firstName} ${apiPatient.lastName}`,
    email: apiPatient.email,
    program: apiPatient.carePlanId, 
    gender: "Unknown", 
    dob: apiPatient.dob,
    age: calculateAge(apiPatient.dob),
    phone: apiPatient.contactInfo?.phone || "", 
    tags: ["CCM", "RPM"], 
  }));

  // Mock patient data
  // const mockPatients: Patient[] = [
  //   {
  //     id: 1,
  //     name: "Edna Mustard",
  //     email: "howabouthuuguyen@gmail.com",
  //     program: "50345",
  //     gender: "Female",
  //     dob: "12/27/1995",
  //     age: 29,
  //     phone: "(+1) 564-243-269",
  //     tags: ["CCM", "RPM"],
  //   },
  //   {
  //     id: 2,
  //     name: "John Smith",
  //     email: "john.smith@email.com",
  //     program: "50346",
  //     gender: "Male",
  //     dob: "05/15/1988",
  //     age: 36,
  //     phone: "(+1) 555-123-456",
  //     tags: ["CCM"],
  //   },
  //   {
  //     id: 3,
  //     name: "Sarah Johnson",
  //     email: "sarah.j@email.com",
  //     program: "50347",
  //     gender: "Female",
  //     dob: "08/22/1992",
  //     age: 32,
  //     phone: "(+1) 555-789-012",
  //     tags: ["RPM"],
  //   },
  //   {
  //     id: 4,
  //     name: "Michael Brown",
  //     email: "mbrown@email.com",
  //     program: "50348",
  //     gender: "Male",
  //     dob: "11/03/1985",
  //     age: 39,
  //     phone: "(+1) 555-345-678",
  //     tags: ["CCM", "RPM"],
  //   },
  //   {
  //     id: 5,
  //     name: "Emily Davis",
  //     email: "emily.davis@email.com",
  //     program: "50349",
  //     gender: "Female",
  //     dob: "03/18/1990",
  //     age: 34,
  //     phone: "(+1) 555-901-234",
  //     tags: ["CCM"],
  //   },
  // ]

  const mockPatients : Patient[] = patients_list;

  const filteredPatients = mockPatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handlePatientClick = (patient: Patient) => {
    onSelect(patient)
    setSearchTerm("")
  }

  const getAvatarColor = (name: string) => {
    const colors = ["#ff9966", "#66b3ff", "#99ff99", "#ffcc66", "#ff99cc"]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <Modal
      title="Search for patient"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      className="patientSearchModal"
    >
      <div className="searchContainer">
        <Input
          placeholder="Search for patient's name or email"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="modalSearchInput"
          // autoFocus
        />
      </div>

      <List
        className="patientList"
        dataSource={filteredPatients}
        renderItem={(patient) => (
          <List.Item className="patientListItem" onClick={() => handlePatientClick(patient)}>
            <div className="patientItemContent">
              <Avatar className="patientItemAvatar" style={{ backgroundColor: getAvatarColor(patient.name) }}>
                {patient.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Avatar>
              <div className="patientItemInfo">
                <div className="patientItemHeader">
                  <span className="patientItemName">{patient.name}</span>
                  {patient.tags.map((tag) => (
                    <Tag key={tag} color="blue" className="patientItemTag">
                      {tag}
                    </Tag>
                  ))}
                </div>
                <div className="patientItemEmail">
                  {patient.email} | Program {patient.program}
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
    </Modal>
  )
}

export default PatientModal
