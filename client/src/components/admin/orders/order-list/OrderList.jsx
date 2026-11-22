import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { getOrders, updateOrderStatus } from '../../../../services/orders';
import {
    STATUSES,
    STATUS_LABELS,
    STATUS_TAB_LABELS,
    CLOSED_STATUSES,
    CHANNEL_LABELS,
    COURIER_LABELS,
    PAYMENT_LABELS,
    statusClass,
    formatOrderNumber,
    formatMoney,
    deadlineInfo,
    daysUntil,
} from '../../../../utils/orders';
import '../orders.css';
import './OrderList.css';

function deliveryText(order) {
    const courier = COURIER_LABELS[order.courier];
    return order.trackingNumber ? `${courier} · № ${order.trackingNumber}` : courier;
}

function paymentText(order) {
    const method = PAYMENT_LABELS[order.paymentMethod];
    return order.isPaid ? `${method} · платено` : method;
}

const MONTH_NAMES = [
    'Януари', 'Февруари', 'Март', 'Април', 'Май', 'Юни',
    'Юли', 'Август', 'Септември', 'Октомври', 'Ноември', 'Декември',
];

function pad(number) {
    return String(number).padStart(2, '0');
}

// Месецът, в който е влязла поръчката, напр. „2026-11“ (по часа на компютъра).
function monthKey(value) {
    const date = new Date(value);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

function monthLabel(key) {
    const [year, month] = key.split('-');
    return `${MONTH_NAMES[Number(month) - 1]} ${year}`;
}

// Кога е влязла поръчката – дата и час поотделно.
function orderedAt(value) {
    const date = new Date(value);
    return {
        date: `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`,
        time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
    };
}

function ordersCountText(count) {
    return `${count} ${count === 1 ? 'поръчка' : 'поръчки'}`;
}

export default function OrderList() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [tab, setTab] = useState('active');
    const [search, setSearch] = useState('');
    const [courier, setCourier] = useState('');
    const [month, setMonth] = useState('');
    const [channel, setChannel] = useState('');
    const [sort, setSort] = useState('deadline');

    useEffect(() => {
        async function loadOrders() {
            try {
                setOrders(await getOrders());
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadOrders();
    }, []);

    const activeOrders = orders.filter(order => !CLOSED_STATUSES.includes(order.status));

    const urgentCount = activeOrders.filter(
        order => order.deadline && daysUntil(order.deadline) <= 3
    ).length;

    // Месеците, в които има поръчки – най-новият е първи.
    const monthOptions = useMemo(
        () => [...new Set(orders.map(order => monthKey(order.createdAt)))].sort().reverse(),
        [orders]
    );

    const monthOrders = useMemo(
        () => (month ? orders.filter(order => monthKey(order.createdAt) === month) : orders),
        [orders, month]
    );

    // Броят в табовете е за избрания месец.
    const tabs = [
        {
            value: 'active',
            label: 'Активни',
            count: monthOrders.filter(order => !CLOSED_STATUSES.includes(order.status)).length,
        },
        { value: 'all', label: 'Всички', count: monthOrders.length },
        ...STATUSES.map(status => ({
            value: status,
            label: STATUS_TAB_LABELS[status],
            count: monthOrders.filter(order => order.status === status).length,
        })),
    ];

    const handleMonthChange = value => {
        setMonth(value);

        // За месец обикновено искаме всички поръчки, не само активните.
        if (value && tab === 'active') {
            setTab('all');
        }
    };

    const visibleOrders = useMemo(() => {
        const query = search.trim().toLowerCase();
        const digits = query.replace(/\s/g, '');

        const filtered = monthOrders.filter(order => {
            if (tab === 'active' && CLOSED_STATUSES.includes(order.status)) return false;
            if (tab !== 'active' && tab !== 'all' && order.status !== tab) return false;
            if (courier && order.courier !== courier) return false;
            if (channel && order.channel !== channel) return false;

            if (query) {
                const matches =
                    order.customerName.toLowerCase().includes(query) ||
                    order.customerPhone.replace(/\s/g, '').includes(digits) ||
                    formatOrderNumber(order.number).toLowerCase().includes(query);

                if (!matches) return false;
            }

            return true;
        });

        return [...filtered].sort((a, b) => {
            if (sort === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }

            // Поръчките без срок отиват най-отдолу.
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline) - new Date(b.deadline);
        });
    }, [monthOrders, tab, search, courier, channel, sort]);

    // Обобщение на показаните поръчки. Отказаните не влизат в сумата.
    const summary = useMemo(() => {
        const counted = visibleOrders.filter(order => order.status !== 'CANCELLED');

        return {
            count: visibleOrders.length,
            cancelled: visibleOrders.length - counted.length,
            total: counted.reduce((sum, order) => sum + Number(order.total || 0), 0),
        };
    }, [visibleOrders]);

    const handleStatusChange = async (order, status) => {
        const previousStatus = order.status;

        // Сменяме веднага на екрана и връщаме, ако сървърът откаже.
        setOrders(current =>
            current.map(item => (item.id === order.id ? { ...item, status } : item))
        );

        try {
            await updateOrderStatus(order.id, status);
        } catch (err) {
            setError(err.message);
            setOrders(current =>
                current.map(item =>
                    item.id === order.id ? { ...item, status: previousStatus } : item
                )
            );
        }
    };

    return (
        <div className="orders-page">
            <div className="order-list-top">
                <div>
                    <h2>Поръчки</h2>
                    {!isLoading && (
                        <p className="orders-muted">
                            {activeOrders.length} активни · {urgentCount} със срок до 3 дни
                        </p>
                    )}
                </div>

                <Link to="/admin/orders/create" className="orders-btn">
                    + Нова поръчка
                </Link>
            </div>

            <div className="order-tabs" role="group" aria-label="Статус">
                {tabs.map(item => (
                    <button
                        type="button"
                        key={item.value}
                        className={`order-tab ${tab === item.value ? 'active' : ''}`}
                        aria-pressed={tab === item.value}
                        onClick={() => setTab(item.value)}
                    >
                        <span>{item.label}</span>
                        <span className="order-tab-count">{item.count}</span>
                    </button>
                ))}
            </div>

            <div className="order-tabs-mobile">
                <label htmlFor="order-tab-select" className="visually-hidden">
                    Покажи поръчки
                </label>
                <select
                    id="order-tab-select"
                    className="orders-input"
                    value={tab}
                    onChange={event => setTab(event.target.value)}
                >
                    {tabs.map(item => (
                        <option key={item.value} value={item.value}>
                            {item.label} ({item.count})
                        </option>
                    ))}
                </select>
            </div>

            <div className="order-filters">
                <label htmlFor="order-search" className="visually-hidden">
                    Търсене
                </label>
                <input
                    id="order-search"
                    type="search"
                    className="orders-input order-search"
                    placeholder="Търси по име, телефон или номер"
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                />

                <div className="order-filter">
                    <label htmlFor="order-month" className="orders-muted">Месец</label>
                    <select
                        id="order-month"
                        className="orders-input order-select"
                        value={month}
                        onChange={event => handleMonthChange(event.target.value)}
                    >
                        <option value="">Всички месеци</option>
                        {monthOptions.map(key => (
                            <option key={key} value={key}>{monthLabel(key)}</option>
                        ))}
                    </select>
                </div>

                <div className="order-filter">
                    <label htmlFor="order-channel" className="orders-muted">Откъде</label>
                    <select
                        id="order-channel"
                        className="orders-input order-select"
                        value={channel}
                        onChange={event => setChannel(event.target.value)}
                    >
                        <option value="">Отвсякъде</option>
                        {Object.entries(CHANNEL_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="order-filter">
                    <label htmlFor="order-courier" className="orders-muted">Куриер</label>
                    <select
                        id="order-courier"
                        className="orders-input order-select"
                        value={courier}
                        onChange={event => setCourier(event.target.value)}
                    >
                        <option value="">Всички</option>
                        {Object.entries(COURIER_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>
                </div>

                <div className="order-filter">
                    <label htmlFor="order-sort" className="orders-muted">Подреди по</label>
                    <select
                        id="order-sort"
                        className="orders-input order-select"
                        value={sort}
                        onChange={event => setSort(event.target.value)}
                    >
                        <option value="deadline">Краен срок</option>
                        <option value="newest">Най-нови</option>
                    </select>
                </div>
            </div>

            {error && <p className="orders-message orders-message--error">{error}</p>}

            <div className="orders-card order-table">
                <div className="order-row order-row--head" aria-hidden="true">
                    <span>Номер</span>
                    <span>Дата</span>
                    <span>Клиент</span>
                    <span>Продукти</span>
                    <span>Краен срок</span>
                    <span>Статус</span>
                    <span>Доставка</span>
                    <span className="order-amount">Сума</span>
                </div>

                {isLoading && <p className="order-empty">Зареждане...</p>}

                {!isLoading && visibleOrders.length === 0 && (
                    <p className="order-empty">
                        {orders.length === 0
                            ? 'Още няма поръчки. Добавете първата с „+ Нова поръчка“.'
                            : 'Няма поръчки, които отговарят на търсенето.'}
                    </p>
                )}

                {visibleOrders.map(order => {
                    const due = deadlineInfo(order);
                    const created = orderedAt(order.createdAt);
                    const [firstItem, ...otherItems] = order.items;

                    return (
                        <div className="order-row" key={order.id}>
                            <Link to={`/admin/orders/${order.id}`} className="order-number">
                                {formatOrderNumber(order.number)}
                            </Link>

                            <div className="order-cell order-date" title="Кога е влязла поръчката">
                                <span>{created.date}</span>
                                <span className="order-sub">{created.time}</span>
                            </div>

                            <div className="order-cell">
                                <span className="order-ellipsis">{order.customerName}</span>
                                <span className="order-sub">
                                    {order.customerPhone} · {CHANNEL_LABELS[order.channel]}
                                </span>
                            </div>

                            <div className="order-cell">
                                <span className="order-ellipsis">
                                    {firstItem?.name}
                                    {firstItem && firstItem.quantity > 1 && ` ×${firstItem.quantity}`}
                                </span>
                                {otherItems.length > 0 && (
                                    <span className="order-sub order-ellipsis">
                                        + {otherItems.length} още: {otherItems.map(item => item.name).join(', ')}
                                    </span>
                                )}
                            </div>

                            <div className="order-cell">
                                <span className={due.className}>{due.text}</span>
                                {due.date && <span className="order-sub">{due.date}</span>}
                            </div>

                            <div>
                                <label htmlFor={`status-${order.id}`} className="visually-hidden">
                                    Статус на {formatOrderNumber(order.number)}
                                </label>
                                <select
                                    id={`status-${order.id}`}
                                    className={`order-status-select ${statusClass(order.status)}`}
                                    value={order.status}
                                    onChange={event => handleStatusChange(order, event.target.value)}
                                >
                                    {STATUSES.map(status => (
                                        <option key={status} value={status}>
                                            {STATUS_LABELS[status]}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="order-cell">
                                <span className="order-ellipsis">{deliveryText(order)}</span>
                            </div>

                            <div className="order-cell order-amount">
                                <span>{formatMoney(order.total)}</span>
                                <span className="order-sub">{paymentText(order)}</span>
                            </div>
                        </div>
                    );
                })}

                {!isLoading && visibleOrders.length > 0 && (
                    <div className="order-summary">
                        <div>
                            Общо: <strong>{ordersCountText(summary.count)}</strong>
                            {summary.cancelled > 0 && (
                                <span className="order-sub order-summary-note">
                                    Отказаните ({summary.cancelled}) не влизат в сумата
                                </span>
                            )}
                        </div>
                        <div className="order-summary-total">
                            Обща сума: <strong>{formatMoney(summary.total)}</strong>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
