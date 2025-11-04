import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import { useAppSelector } from '@store/index';
import { PATH_NAME, SSOCOOKIES } from '@constants/index';
import { AppointmentCreatedData, ReportCreatedData } from 'src/types/socket';
// import { useNavigate } from 'react-router-dom';
import { useRefreshToken } from '@hooks/authen/useRefreshToken';
import { replace } from 'lodash';

// Socket Context Types
interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

// Create Context
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Socket Provider Props
interface SocketProviderProps {
  children: ReactNode;
}

// Socket Provider Component
export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  //phần cho check acess + refresh:
  const [isRefreshing, setIsRefreshing] = useState(false);
  // const navigate = useNavigate();
  const { onHandleRefreshToken } = useRefreshToken();

  const user = useAppSelector((state) => state.authenticator.user);
  console.log("user from redux: ", user);
  const isAuthenticated = useAppSelector((state) => state.authenticator.authenticated);

  // Socket configuration
  const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:8001';


  // Connect to socket server
  useEffect(() => {
    if (!isAuthenticated || !user) {
      // Disconnect if not authenticated
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const accessToken = Cookies.get(SSOCOOKIES.access);
    if (!accessToken) {
      console.log('Cannot connect to socket: No access token');
      return;
    }

    console.log('🔌 Connecting to socket server...');

    console.log("check socket url: ", SOCKET_SERVER_URL);

    const newSocket = io(SOCKET_SERVER_URL, {
      auth: {
        token: accessToken
      },
      extraHeaders: {
        'user-role': user.role,
        'user-id': user.id,
        'patient-id': user.role === 'PATIENT' ? user.id : '',
        'facility-ids': user.facilities?.join(',') || ''
      }
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Connected to socket server');
      console.log('Socket ID:', newSocket.id);
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from socket server');
      setIsConnected(false);
    });

    //custom để bắt được lỗi token expired:
    newSocket.on('connect_error', async (error: any) => {
      const code = error?.data?.code;

      if (code === 1006 || error?.data?.cause === 'TOKEN_EXPIRED') {
        setIsRefreshing(true);
        try {
          const refreshToken = Cookies.get(SSOCOOKIES.refresh) || '';
          if (!refreshToken || refreshToken === '') {
            //đá ra login:
            Cookies.remove(SSOCOOKIES.access);
            Cookies.remove(SSOCOOKIES.refresh);
            // navigate('/login');
            window.location.replace(PATH_NAME.LOGIN);
          }

          const res = await onHandleRefreshToken({ refreshToken });
          const newAccessToken = res?.accessToken || '';

          if (!newAccessToken || newAccessToken === '') {
            //đá ra login:
            Cookies.remove(SSOCOOKIES.access);
            Cookies.remove(SSOCOOKIES.refresh);
            // navigate('/login');
            window.location.replace(PATH_NAME.LOGIN);
          }

          //Lưu accessToken mới vào cookie + reconnect socket
          Cookies.set(SSOCOOKIES.access, newAccessToken);
          newSocket.auth = { token: newAccessToken };
          //nếu đang ở trạng thái lỗi -> gọi connect để thử lại
          newSocket.connect();
        } catch (e) {
          //refresh lỗi -> đưa về login
          Cookies.remove(SSOCOOKIES.access);
          Cookies.remove(SSOCOOKIES.refresh);

          try {
            newSocket.disconnect();
          } catch { 
            //
          }
          // navigate(PATH_NAME.LOGIN, {replace: true})
          window.location.replace(PATH_NAME.LOGIN);
        } finally {
          setIsRefreshing(false);
        }
      }
    });

    // Business events
    newSocket.on('new_appointment', (data: AppointmentCreatedData) => {
      console.log('📅 Received new appointment:', data);
      // You can dispatch to Redux store or show notification here
    });

    newSocket.on('new_report', (data: ReportCreatedData) => {
      console.log('📊 Received new report:', data);
      // You can dispatch to Redux store or show notification here
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  const contextValue: SocketContextType = {
    socket,
    isConnected
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use socket context
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
