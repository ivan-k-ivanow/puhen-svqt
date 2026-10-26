import AdminHeader from "../../components/admin/admin-header/AdminHeader";
import AdminLoginForm from "../../components/admin/admin-login-form/AdminLoginForm";
import AdminTestInfo from "../../components/admin/admin-test-info/AdminTestInfo";



export default function AdminLogin() {
    return (
        <>
            <div className="admin-page">

                <AdminHeader />
                <AdminTestInfo />
                <AdminLoginForm />
            </div>
        </>
    );
}