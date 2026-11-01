import AdminHeader from "../../components/admin/admin-header/AdminHeader";
import AdminLoginForm from "../../components/admin/admin-login-form/AdminLoginForm";



export default function AdminLogin() {
    return (
        <>
            <div className="admin-page">
                <AdminHeader />
                <AdminLoginForm />
            </div>
        </>
    );
}