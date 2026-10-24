import { Navigate, Outlet } from 'react-router';
import useAuth from '../../contexts/useAuth';

const ProtectedRoute = ({ redirectPath = '/admin/login' }) => {
    const { user, isLoading } = useAuth();

   if (isLoading) {
    return <p>Проверка на автентикация...</p>;
   }

   if (!user || user.role !== 'ADMIN') {
       return <Navigate to="/admin/login" replace />;
   }

   return <Outlet />;
};

export default ProtectedRoute;