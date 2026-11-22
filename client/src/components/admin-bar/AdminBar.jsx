import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import useAuth from '../../contexts/useAuth';
import { getProductBySlug } from '../../services/products';
import './AdminBar.css';

// Малка лента в долния ляв ъгъл, видима само за влезлия админ.
// В сайта води към админа (и към редакцията на отворения продукт),
// а в админа – обратно към сайта.
export default function AdminBar() {
    const { user } = useAuth();
    const { pathname } = useLocation();

    const isAdmin = user?.role === 'ADMIN';
    const inAdmin = pathname.startsWith('/admin');
    const productSlug = pathname.match(/^\/products\/([^/]+)$/)?.[1] ?? null;

    // id на продукта, нужен за линка към редакцията му
    const [found, setFound] = useState({ slug: null, id: null });
    const productId = found.slug === productSlug ? found.id : null;

    useEffect(() => {
        if (!isAdmin || !productSlug) return;

        let cancelled = false;

        getProductBySlug(productSlug)
            .then(product => {
                if (!cancelled) setFound({ slug: productSlug, id: product?.id ?? null });
            })
            .catch(() => {});

        return () => {
            cancelled = true;
        };
    }, [isAdmin, productSlug]);

    if (!isAdmin || pathname === '/admin/login') {
        return null;
    }

    return (
        <div className="admin-bar" role="region" aria-label="Админ">
            <span className="admin-bar-label">
                <span className="admin-bar-dot" aria-hidden="true" />
                <span className="admin-bar-wide">Админ</span>
            </span>

            {inAdmin ? (
                <Link to="/" className="admin-bar-link admin-bar-link--main">Към сайта</Link>
            ) : (
                <>
                    {productId && (
                        <Link to={`/admin/products/edit/${productId}`} className="admin-bar-link">
                            Редактирай<span className="admin-bar-wide"> продукта</span>
                        </Link>
                    )}
                    <Link to="/admin/orders" className="admin-bar-link">Поръчки</Link>
                    <Link to="/admin/dashboard" className="admin-bar-link admin-bar-link--main">Админ панел</Link>
                </>
            )}
        </div>
    );
}
