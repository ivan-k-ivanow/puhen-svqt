import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router';
import useAuth from '../../../contexts/useAuth';
import { getOrderCounts } from '../../../services/orders';
import './AdminHeader.css';

const SECTIONS = [
    { key: 'orders', label: 'Поръчки', to: '/admin/orders', match: ['/admin/orders'] },
    { key: 'products', label: 'Продукти', to: '/admin/dashboard', match: ['/admin/dashboard', '/admin/products'] },
    { key: 'categories', label: 'Категории', to: '/admin/categories/create', match: ['/admin/categories'] },
];

const CREATE = [
    { label: 'Поръчка', hint: 'Приета по телефон или съобщение', to: '/admin/orders/create', icon: 'orders' },
    { label: 'Продукт', hint: 'Нов продукт в каталога', to: '/admin/products/create', icon: 'products' },
    { label: 'Категория', hint: 'Повод или вид подарък', to: '/admin/categories/create', icon: 'categories' },
];

function Icon({ name, size = 18 }) {
    const props = {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.9,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        'aria-hidden': true,
    };

    switch (name) {
        case 'orders':
            return <svg {...props}><path d="M6 3h12l2 5H4z" /><path d="M4 8h16v11a2 2 0 01-2 2H6a2 2 0 01-2-2z" /><path d="M9 12h6" /></svg>;
        case 'products':
            return <svg {...props}><rect x="3" y="9" width="18" height="12" rx="2" /><path d="M12 9v12M3 13h18" /><path d="M12 9c-2-4-6-4-6-1.5S10 9 12 9zM12 9c2-4 6-4 6-1.5S14 9 12 9z" /></svg>;
        case 'categories':
            return <svg {...props}><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8.5" r="1.3" /></svg>;
        case 'profile':
            return <svg {...props}><circle cx="12" cy="8" r="3.5" /><path d="M5 20c1.2-3.5 4-5 7-5s5.8 1.5 7 5" /></svg>;
        case 'plus':
            return <svg {...props} strokeWidth="2.4"><path d="M12 5v14M5 12h14" /></svg>;
        case 'chevron':
            return <svg {...props} strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg>;
        case 'external':
            return <svg {...props} strokeWidth="2"><path d="M14 4h6v6" /><path d="M20 4l-9 9" /><path d="M19 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1h5" /></svg>;
        case 'home':
            return <svg {...props}><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" /></svg>;
        case 'logout':
            return <svg {...props}><path d="M15 4h3a2 2 0 012 2v12a2 2 0 01-2 2h-3" /><path d="M10 17l-5-5 5-5M5 12h11" /></svg>;
        default:
            return null;
    }
}

export default function AdminHeader() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const isAdmin = user?.role === 'ADMIN';

    // Кое меню е отворено ('' | 'create' | 'profile') и на коя страница.
    // При смяна на страницата менюто се затваря само.
    const [openMenu, setOpenMenu] = useState({ name: '', path: '' });
    const menu = openMenu.path === pathname ? openMenu.name : '';
    const setMenu = name => setOpenMenu({ name, path: pathname });
    const [newOrders, setNewOrders] = useState(0);
    const headerRef = useRef(null);
    const tabbarRef = useRef(null);
    const sheetRef = useRef(null);

    const activeKey = SECTIONS.find(section =>
        section.match.some(prefix => pathname.startsWith(prefix))
    )?.key;

    // Брояч на новите поръчки – обновява се при всяка смяна на страницата.
    useEffect(() => {
        if (!isAdmin) return;

        let cancelled = false;

        getOrderCounts()
            .then(counts => {
                if (!cancelled) setNewOrders(counts?.new ?? 0);
            })
            .catch(() => {});

        return () => {
            cancelled = true;
        };
    }, [isAdmin, pathname]);

    // Затваряме менюто при клик извън него или Escape.
    useEffect(() => {
        if (!menu) return;

        const onClick = event => {
            const inside = [headerRef, tabbarRef, sheetRef].some(ref => ref.current?.contains(event.target));
            if (!inside) setMenu('');
        };
        const onKey = event => {
            if (event.key === 'Escape') setMenu('');
        };

        document.addEventListener('mousedown', onClick);
        document.addEventListener('keydown', onKey);

        return () => {
            document.removeEventListener('mousedown', onClick);
            document.removeEventListener('keydown', onKey);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [menu]);

    const toggle = name => setMenu(menu === name ? '' : name);

    const handleLogout = async () => {
        setMenu('');

        try {
            await logout();
            navigate('/admin/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const initial = (user?.email?.[0] ?? 'А').toUpperCase();
    const badgeLabel = `${newOrders} ${newOrders === 1 ? 'нова поръчка' : 'нови поръчки'}`;

    const createMenu = (
        <div className="ah-drop ah-drop--create" role="menu">
            {CREATE.map(item => (
                <Link key={item.to} to={item.to} className="ah-drop-item" role="menuitem">
                    <span className="ah-drop-icon"><Icon name={item.icon} size={17} /></span>
                    <span>
                        <b>{item.label}</b>
                        <small>{item.hint}</small>
                    </span>
                </Link>
            ))}
        </div>
    );

    const profileMenu = (
        <div className="ah-drop ah-drop--profile" role="menu">
            <div className="ah-who">
                <span className="ah-avatar ah-avatar--static" aria-hidden="true">{initial}</span>
                <span className="ah-who-text">
                    <b>Админ</b>
                    <span>{user?.email}</span>
                </span>
            </div>
            <a href="/" target="_blank" rel="noopener noreferrer" className="ah-drop-item" role="menuitem">
                <span className="ah-drop-icon"><Icon name="home" size={17} /></span>
                <span><b>Към сайта</b><small>Отваря се в нов таб</small></span>
            </a>
            <button type="button" className="ah-drop-item ah-drop-item--danger" role="menuitem" onClick={handleLogout}>
                <span className="ah-drop-icon"><Icon name="logout" size={17} /></span>
                <span><b>Изход</b></span>
            </button>
        </div>
    );

    return (
        <>
            <header className="admin-header" ref={headerRef}>
                <div className="ah-bar">
                    <Link to={isAdmin ? '/admin/orders' : '/admin/login'} className="ah-brand">
                        <img src="/images/logo.png" alt="Пухен Свят" />
                        <span className="ah-tag">Админ</span>
                    </Link>

                    {isAdmin && (
                        <nav className="ah-nav" aria-label="Админ">
                            {SECTIONS.map(section => (
                                <NavLink
                                    key={section.key}
                                    to={section.to}
                                    className={`ah-nav-item ${activeKey === section.key ? 'is-active' : ''}`}
                                    aria-current={activeKey === section.key ? 'page' : undefined}
                                >
                                    <Icon name={section.key} />
                                    {section.label}
                                    {section.key === 'orders' && newOrders > 0 && (
                                        <span className="ah-badge" aria-label={badgeLabel}>{newOrders}</span>
                                    )}
                                </NavLink>
                            ))}
                        </nav>
                    )}

                    <div className="ah-right">
                        {isAdmin ? (
                            <>
                                <div className="ah-menu-wrap">
                                    <button
                                        type="button"
                                        className={`ah-new ${menu === 'create' ? 'is-open' : ''}`}
                                        aria-haspopup="menu"
                                        aria-expanded={menu === 'create'}
                                        aria-label="Ново"
                                        onClick={() => toggle('create')}
                                    >
                                        <Icon name="plus" size={16} />
                                        <span className="ah-new-text">Създай</span>
                                        <span className="ah-new-chevron"><Icon name="chevron" size={14} /></span>
                                    </button>
                                    {menu === 'create' && createMenu}
                                </div>

                                <a
                                    href="/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ah-ghost"
                                    aria-label="Към сайта (нов таб)"
                                    title="Към сайта"
                                >
                                    <Icon name="external" size={16} />
                                    <span className="ah-ghost-text">Към сайта</span>
                                </a>

                                <div className="ah-menu-wrap ah-profile-wrap">
                                    <button
                                        type="button"
                                        className={`ah-avatar ${menu === 'profile' ? 'is-open' : ''}`}
                                        aria-haspopup="menu"
                                        aria-expanded={menu === 'profile'}
                                        aria-label="Профил"
                                        onClick={() => toggle('profile')}
                                    >
                                        {initial}
                                    </button>
                                    {menu === 'profile' && profileMenu}
                                </div>
                            </>
                        ) : (
                            <a href="/" className="ah-ghost ah-ghost--always">
                                <Icon name="external" size={16} />
                                <span className="ah-ghost-text">Към сайта</span>
                            </a>
                        )}
                    </div>
                </div>
            </header>

            {/* На телефон: меню долу, на една ръка разстояние */}
            {isAdmin && (
                <nav className="ah-tabbar" aria-label="Админ – мобилно" ref={tabbarRef}>
                    {SECTIONS.map(section => (
                        <NavLink
                            key={section.key}
                            to={section.to}
                            className={`ah-tab ${activeKey === section.key && menu !== 'profile' ? 'is-active' : ''}`}
                            aria-current={activeKey === section.key ? 'page' : undefined}
                        >
                            <span className="ah-tab-icon">
                                <Icon name={section.key} size={22} />
                                {section.key === 'orders' && newOrders > 0 && (
                                    <span className="ah-badge ah-badge--tab" aria-label={badgeLabel}>{newOrders}</span>
                                )}
                            </span>
                            {section.label}
                        </NavLink>
                    ))}
                    <button
                        type="button"
                        className={`ah-tab ${menu === 'profile' ? 'is-active' : ''}`}
                        aria-haspopup="dialog"
                        aria-expanded={menu === 'profile'}
                        onClick={() => toggle('profile')}
                    >
                        <span className="ah-tab-icon"><Icon name="profile" size={22} /></span>
                        Профил
                    </button>
                </nav>
            )}

            {/* Панел отдолу на телефон за „+“ и „Профил“ */}
            {isAdmin && menu && (
                <div className="ah-sheet-layer" ref={sheetRef}>
                    <button type="button" className="ah-shade" aria-label="Затвори" onClick={() => setMenu('')} />
                    <div className="ah-sheet" role="dialog" aria-label={menu === 'create' ? 'Добави ново' : 'Профил'}>
                        <span className="ah-grab" aria-hidden="true" />
                        {menu === 'create' && <p className="ah-sheet-title">Добави ново</p>}
                        {menu === 'create' ? createMenu : profileMenu}
                    </div>
                </div>
            )}
        </>
    );
}
