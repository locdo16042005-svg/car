import { useSelector } from 'react-redux';

/**
 * Hook to access auth state from Redux store
 */
export function useAuth() {
  const { token, role, fullName, isAuthenticated } = useSelector((state) => state.auth);

  return {
    token,
    role,
    fullName,
    isAuthenticated,
    isAdmin: role === 'ADMIN',
    isUser: role === 'USER',
  };
}

export default useAuth;
