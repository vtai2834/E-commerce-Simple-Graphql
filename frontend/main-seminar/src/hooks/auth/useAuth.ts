import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export function useAuth() {
  const { user, authenticated } = useSelector((state: RootState) => state.authenticator);
  
  return {
    user,
    isAuthenticated: authenticated,
  };
}
