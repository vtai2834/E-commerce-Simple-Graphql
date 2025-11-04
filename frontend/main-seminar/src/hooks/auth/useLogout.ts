import { useMutation, gql } from "@apollo/client";
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authenticator-slice';
import { SSOCOOKIES } from '../../constants';
import { useAuth } from './useAuth';

const LOGOUT_MUTATION = gql`
  mutation Logout($input: LogoutInput!) {
    logout(input: $input) {
      code
      isSuccess
      message
    }
  }
`;

export function useLogout() {
  const [logoutMutation, { loading }] = useMutation(LOGOUT_MUTATION);
  const dispatch = useDispatch();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      // 1. Gọi logout mutation để xóa token khỏi Redis backend
      if (user?.id) {
        await logoutMutation({
          variables: { 
            input: { userId: user.id } 
          }
        });
      }
    } catch (error) {
      console.error('Backend logout error:', error);
      // Vẫn tiếp tục clear local state dù backend lỗi
    } finally {
      // 2. Clear cookies
      Cookies.remove(SSOCOOKIES.access);
      Cookies.remove(SSOCOOKIES.refresh);
      
      // 3. Clear Redux state
      dispatch(logout());
      
      // 4. Redirect to login
      window.location.href = '/login';
    }
  };

  return [handleLogout, { loading }] as const;
}
