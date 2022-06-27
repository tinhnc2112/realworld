import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '~/components/hooks/useAuth';
import { token } from '~/components/common/common';
function RequireAuth({ children }) {
   const { auth } = useAuth();
   const location = useLocation();
   return token ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}

export default RequireAuth;
