import { Navigate, Outlet, useLocation } from 'react-router';
import useAuth from '../../contexts/useAuth';

const ProtectedRoute = () => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <p>Проверка на автентикация...</p>;
    }

    if (!user || user.role !== 'ADMIN') {
        // Запомняме страницата, за да се върнем на нея след входа.
        const from = location.pathname + location.search;

        return <Navigate to="/admin/login" replace state={{ from }} />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
