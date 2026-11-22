import { Link, useLocation } from 'react-router';
import useAuth from '../../contexts/useAuth';
import './AdminBar.css';

// Малка лента в долния ляв ъгъл, видима само за влезлия админ,
// докато разглежда сайта като клиент.
export default function AdminBar() {
    const { user } = useAuth();
    const { pathname } = useLocation();

    if (user?.role !== 'ADMIN' || pathname.startsWith('/admin')) {
        return null;
    }

    return (
        <div className="admin-bar" role="region" aria-label="Админ">
            <span className="admin-bar-label">
                <span className="admin-bar-dot" aria-hidden="true" />
                Админ
            </span>
            <Link to="/admin/orders" className="admin-bar-link">Поръчки</Link>
            <Link to="/admin/dashboard" className="admin-bar-link admin-bar-link--main">Админ панел</Link>
        </div>
    );
}
