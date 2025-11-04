import React from 'react';
// import { useAppSelector } from '../../store';
// import PatientDashboard from '@pages/patient-dashboard';
// import PhysicianDashboard from '@pages/physician-dashboard';
import { Outlet } from 'react-router-dom';

const MainBoard: React.FC = () => {
  // const user = useAppSelector((state) => state.authenticator.user);

  // const renderDashboard = useMemo(() => {
  //   return {
  //     PATIENT: <PatientDashboard />,
  //     PHYSICIAN: <PhysicianDashboard/>,
  //   }[user?.role || 'PATIENT'];
  // }, [user?.role]);

  return (
   <Outlet />
  );
};

export default MainBoard;
