import { PlusOutlined, ScheduleOutlined, UserOutlined } from "@ant-design/icons";
import DashboardLayout from "@layouts/dashboard-layout";
import { Tooltip, type MenuProps } from "antd";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSocket } from "../../contexts/SocketContext";

type MenuItem = Required<MenuProps>["items"][number];

const desktopItems: MenuItem[] = [
  {
    key: "careplans",
    icon: <Tooltip placement="right" title="Care Plans">
      <UserOutlined style={{ color: '#003a70', fontSize: '18px' }} />
    </Tooltip>
  },
  {
    key: "new_carePlan",
    icon: <Tooltip placement="right" title="New Care Plan">
      <PlusOutlined style={{ color: '#003a70', fontSize: '18px' }} />
    </Tooltip>
  },
  {
    key: "appointments",
    icon: <Tooltip placement="right" title="Appointments">
      <ScheduleOutlined style={{ color: '#003a70', fontSize: '18px' }} />
    </Tooltip>,
  }
];

const mobileItems: MenuItem[] = [
];

const PhysicianDashboard = () => {
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const createdHandler = (data: any) => {
      const title = data?.appointmentData?.title || "New appointment";
      toast.info(`📅 ${title} created`);
    };

    const updatedHandler = (data: any) => {
      const status = data?.appointmentData?.status || 'UPDATED';
      toast.info(`📅 Appointment ${status.toLowerCase()}`);
    };

    socket.on('appointment_created', createdHandler);
    socket.on('appointment_updated', updatedHandler);
    return () => {
      socket.off('appointment_created', createdHandler);
      socket.off('appointment_updated', updatedHandler);
    };
  }, [socket]);

  return (
    <DashboardLayout
      desktopItems={desktopItems}
      mobileItems={mobileItems}
    />
  );
};

export default PhysicianDashboard;
