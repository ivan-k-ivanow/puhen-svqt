import { Navigate, useLocation } from "react-router";
import AdminHeader from "../../components/admin/admin-header/AdminHeader";
import AdminLoginForm from "../../components/admin/admin-login-form/AdminLoginForm";
import useAuth from "../../contexts/useAuth";

export default function AdminLogin() {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    // Влезлият админ не вижда формата: връщаме го там, където е искал
    // да отиде преди входа, иначе в поръчките.
    if (!isLoading && user?.role === 'ADMIN') {
        const from = location.state?.from;
        const target = from?.startsWith('/admin') && !from.startsWith('/admin/login') ? from : '/admin/orders';

        return <Navigate to={target} replace />;
    }

    return (
        <div className="admin-page">
            <AdminHeader />
            {!isLoading && <AdminLoginForm />}
        </div>
    );
}
