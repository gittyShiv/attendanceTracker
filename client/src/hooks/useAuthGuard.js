import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const useAuthGuard = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user && location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, [loading, user, navigate, location.pathname]);

  return { user, loading };
};
