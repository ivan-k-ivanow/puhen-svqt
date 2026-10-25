import { Link } from 'react-router';
import { useState } from 'react';
import useAuth from '../../../../contexts/useAuth';

export default function AdminNavigation() {
    const { user, logout, isLoading } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <>
            <nav className={`admin-nav ${isOpen ? "active" : ""}`}>
                {isAdmin ? (<>
                    <Link to="/admin/dashboard" className="admin-nav-btn">Админ панел</Link>
                    <Link to="/admin/products/create" className="admin-nav-btn">Добави продукт</Link>
                    <Link to="/admin/categories/create"className="admin-nav-btn"> Създай категория </Link>

                    <button type="button" className="admin-nav-btn" onClick={handleLogout}>Изход</button>

                </>
                ) : (
                    <Link to="/admin/login" className="admin-nav-btn">Вход</Link>
                )}

            </nav>

            <button className="hamburger" aria-label="Toggle menu" onClick={() => setIsOpen((previousState) => !previousState)}>
                <span></span>
                <span></span>
                <span></span>
            </button>
        </>
    );
}