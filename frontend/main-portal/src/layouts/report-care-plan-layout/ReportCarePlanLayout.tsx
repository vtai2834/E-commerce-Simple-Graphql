import PatientDetailSession from "@pages/detailCarePlan/patientInfoComponent/patientSession";
import { useParams } from "react-router-dom";
import MonitorHealthData from "./tabs/MonitorHealthData";
import { Tabs } from "antd";
import ListReports from "@/features/lists/list-report";

// dayjs.extend(utc);
// dayjs.extend(timezone);

const ReportCarePlanLayout = () => {
  const param = useParams();

  const { carePlanId } = param;

  const itemsTab = [
    {
      key: 'monitor_health_data',
      label: `Monitor Health Data`,
      children: <MonitorHealthData carePlanId={carePlanId || ''} />
    },
    {
      key: 'report',
      label: `Report`,
      children: <ListReports />
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PatientDetailSession carePlanId={carePlanId || ''} />

      <Tabs defaultActiveKey="monitor_health_data" items={itemsTab} />
    </div>
  )
}

export default ReportCarePlanLayout
