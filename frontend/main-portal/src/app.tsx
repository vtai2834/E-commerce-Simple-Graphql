
import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import {  privateRoutes, publicRoutes } from './routers';
import Cookies from "js-cookie";
import { useGetMeInfo } from '@hooks/useGetMeInfo';
import { SSOCOOKIES } from './constants';
import { useAppSelector } from './store';
import PageTest from '@pages/test';
import ErrorBoundary from '@pages/error';
import CreateAppointment from '@pages/physician/createAppointment/createAppointment';

const ProtectedRoute: React.FC = () => {
  const token = Cookies.get(SSOCOOKIES.access);

  const {  loading, error } = useGetMeInfo(token);

  const isAuthenticated = useAppSelector((state) => state.authenticator.authenticated);

  if (!token) return <Navigate to="/login" replace />;

  if (loading) return <div>Loading...</div>;

  if (error) return <Navigate to="/login" replace />;

  // Wait for user data to be loaded before rendering children

  if (isAuthenticated) return <Outlet />;
};

const RedirectByRole: React.FC = () => {
  const user = useAppSelector((state) => state.authenticator.user);

  const role = user?.role ?? "PATIENT";

  return <Navigate to={role} replace />;
};

const PublicRoute: React.FC = () => {
  const token = Cookies.get(SSOCOOKIES.access);

  if (token) {
    return <Navigate to="/mainboard" replace />;
  }

  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute />,
    children: [
      {
        element: <Navigate to="/mainboard" replace />,
      },
      {
        path: "test",
        element: React.createElement(PageTest),
      },
      {
        path: "mainboard",
        children: [
          {
            index: true,
            element: <RedirectByRole />,
          },
          ...privateRoutes,
        ],
      },
    ],
  },
  {
    element: <PublicRoute />,
    children: publicRoutes,
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  }
]);

const App = () => {
  return (
    <div className='app'>
      <ErrorBoundary>
        <RouterProvider router={router} />
        {/* <CreateAppointment /> */}
      </ErrorBoundary>
    </div>
  );
};

export default App;
