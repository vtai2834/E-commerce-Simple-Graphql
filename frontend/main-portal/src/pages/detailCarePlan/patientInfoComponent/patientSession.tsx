import React, { useEffect, useMemo } from "react"
import PatientInfoComponent from "@components/physician/detail-patient-component/detailPatientComponent"
import { usePatientDetail } from "@hooks/patient/usePatientDetail"

interface PatientDetailSessionProps {
  carePlanId?: string
}

const PatientDetailSession: React.FC<PatientDetailSessionProps> = ({ carePlanId }) => {
  const { data, loading, onFetchPatientDetail } = usePatientDetail();

  useEffect(() => {
    if (carePlanId) {
      onFetchPatientDetail({ friendlyId: carePlanId });
    }
  }, [carePlanId, onFetchPatientDetail]);


  // Map API data to patientData for PatientInfoComponent
  const patientData = useMemo(() => {
    console.log("Full data structure:", data);
    if (!data?.patient) return undefined;
    const p = data.patient;
    const c = data.carePlan;
    // Tính tuổi từ dob
    let age = "";
    if (p.dob) {
      const dobDate = new Date(p.dob);
      const now = new Date();
      age = (now.getFullYear() - dobDate.getFullYear() - (now < new Date(now.getFullYear(), dobDate.getMonth(), dobDate.getDate()) ? 1 : 0)).toString();
    }
    return {
      id: p.id ?? undefined,
      name: `${p.firstName} ${p.lastName}`,
      gender: "", // Nếu có gender thì lấy, không thì để rỗng
      age,
      email: p.email ?? undefined,
      programId: p.carePlanId ?? undefined,
      address: p.contactInfo?.address ?? undefined,
      city: p.contactInfo?.city ?? undefined,
      country: p.contactInfo?.country ?? undefined,
      phone: p.contactInfo?.phone ?? undefined,
      state: p.contactInfo?.state ?? undefined,
      notes: c?.note || 'nothing', // Nếu có notes thì lấy, không thì để rỗng
    };
  }, [data]);

  if (loading) {
    return <div>Loading patient data...</div>;
  }

  return (
    <div>
      <PatientInfoComponent patientData={patientData} carePlanId={carePlanId} />
    </div>
  )
}

export default PatientDetailSession
