import { useNavigate, Link } from 'react-router';
import useAuth from '../../../contexts/useAuth';
import AdminNavigation from './AdminNavigation/AdminNavigation';


export default function AdminHeader() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
        }

    };
    return (
        <header className="admin-header">
            <div className="admin-nav-wrapper">
                <Link to="/admin/dashboard" className="logo">
                    <img src="/images/logo.png" alt="Пухен Свят лого" />
                </Link>
                <h1 className="admin-logo">Админ панел</h1>
                
                <AdminNavigation
                    onLogout={handleLogout}
                />

            </div>
        </header>
    );
}