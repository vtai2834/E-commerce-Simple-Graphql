import { HeartOutlined, HomeOutlined, MedicineBoxOutlined, UserOutlined } from "@ant-design/icons";
import DashboardLayout from "@layouts/dashboard-layout";
import { Tooltip, type MenuProps } from "antd";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useSocket } from "../../contexts/SocketContext";

type MenuItem = Required<MenuProps>["items"][number];

const desktopItems: MenuItem[] = [
  {
    key: "home",
    disabled: true,
    icon: <Tooltip placement="right" title="Home">
            <HomeOutlined style={{ color: '#003a70', fontSize: '18px' }} />
          </Tooltip>
  },
  {
    key: "service",
    icon: <Tooltip placement="right" title="Service">
            <MedicineBoxOutlined style={{ color: '#003a70', fontSize: '18px' }} />
          </Tooltip>
  },
  {
    key: "info",
    icon: <Tooltip placement="right" title="Infomation">
            <UserOutlined style={{ color: '#003a70' , fontSize: '18px' }} />
          </Tooltip>,
  },
  {
    key: "health",
    icon: <Tooltip placement="right" title="Health">
            <HeartOutlined style={{ color: '#003a70', fontSize: '18px' }} />
          </Tooltip>,
  },
];

const mobileItems: MenuItem[] = [
  { key: "home", label: "Home", icon: <HomeOutlined style={{ color: '#003a70' }} /> },
  { key: "service", label: "Service", icon: <MedicineBoxOutlined style={{ color: '#003a70' }} /> },
  { key: "profile", label: "Profile", icon: <UserOutlined style={{ color: '#003a70' }} /> },
];

const PatientDashboard = () => {
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

export default PatientDashboard;
