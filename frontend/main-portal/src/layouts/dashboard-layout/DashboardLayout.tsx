import { Menu, Grid, Button } from "antd";
import type { MenuProps } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppSelector } from "@store/index";
import { useLogout } from "@hooks/authen/useLogout";
import './style.scss';

type MenuItem = Required<MenuProps>["items"][number];

interface DashboardLayoutProps{
  desktopItems: MenuItem[];
  mobileItems: MenuItem[];
}

export const DashboardLayout : React.FC<DashboardLayoutProps>= ({ desktopItems, mobileItems }) => {
  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const userId = useAppSelector((state) => state.authenticator.user.id);
  const userRole = useAppSelector((state) => state.authenticator.user.role);
  const user = useAppSelector((state) => state.authenticator.user)

  const { onHandleLogout } = useLogout();

  const navigate = useNavigate();

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(`/mainboard/${userRole}/${e.key}`);
  };

  return (
    <section
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: "100vh",
      }}
    >
      <Menu
        style={{ width: isMobile ? "100%" : 'fit-content'}}
        mode={isMobile ? "horizontal" : "inline"}
        items={isMobile ? mobileItems : desktopItems}
        onClick={handleMenuClick}
        className="dashboard-menu"
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <section className="dashboard-header">
          <h1 className="dashboard-header__title">
            Welcome, {user.firstName} {user.lastName}
          </h1>
          <Button
            type="primary"
            className="dashboard-header__logout"
            onClick={() => onHandleLogout({ input: { userId } })}
          >
            Logout
          </Button>
        </section>

        <div style={{ padding: 24, flex: 1, overflowY: "auto" }}>
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default DashboardLayout;
