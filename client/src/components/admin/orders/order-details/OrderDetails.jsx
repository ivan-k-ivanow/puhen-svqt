import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import {
    getOrderById,
    updateOrderStatus,
    updateOrderPaid,
    deleteOrder,
} from '../../../../services/orders';
import {
    STATUS_FLOW,
    STATUS_LABELS,
    NEXT_STEP_LABELS,
    CHANNEL_LABELS,
    COURIER_LABELS,
    PAYMENT_LABELS,
    statusClass,
    formatOrderNumber,
    formatMoney,
    formatDate,
    formatDateTime,
    deadlineInfo,
} from '../../../../utils/orders';
import '../orders.css';
import './OrderDetails.css';

function CheckIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12l5 5 9-10" />
        </svg>
    );
}

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [trackingDraft, setTrackingDraft] = useState('');

    useEffect(() => {
        async function loadOrder() {
            try {
                const data = await getOrderById(id);
                setOrder(data);
                setTrackingDraft(data.trackingNumber ?? '');
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        loadOrder();
    }, [id]);

    // Общо за всички действия: изпраща заявката и обновява поръчката.
    const run = async (action) => {
        setIsSaving(true);
        setError('');

        try {
            setOrder(await action());
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="orders-page"><p>Зареждане...</p></div>;
    }

    if (!order) {
        return (
            <div className="orders-page">
                <Link to="/admin/orders" className="orders-back">← Всички поръчки</Link>
                <p className="orders-message orders-message--error">
                    {error || 'Поръчката не е намерена.'}
                </p>
            </div>
        );
    }

    const isCancelled = order.status === 'CANCELLED';
    const stepIndex = STATUS_FLOW.indexOf(order.status);
    const nextStatus = !isCancelled ? STATUS_FLOW[stepIndex + 1] : undefined;
    const previousStatus = !isCancelled && stepIndex > 0 ? STATUS_FLOW[stepIndex - 1] : undefined;
    const needsTracking = nextStatus === 'SHIPPED' && order.courier !== 'PICKUP';

    // При възстановяване връщаме последния статус преди отказа.
    const statusBeforeCancel =
        order.history.find(entry => entry.status && entry.status !== 'CANCELLED')?.status ?? 'NEW';

    const due = deadlineInfo(order);

    const handleNext = () => {
        run(() => updateOrderStatus(order.id, nextStatus, needsTracking ? trackingDraft.trim() : undefined));
    };

    const handleCancel = () => {
        if (window.confirm('Сигурни ли сте, че искате да откажете поръчката?')) {
            run(() => updateOrderStatus(order.id, 'CANCELLED'));
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Поръчката ще бъде изтрита завинаги. Продължаване?')) {
            return;
        }

        try {
            await deleteOrder(order.id);
            navigate('/admin/orders');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="orders-page">
            <div>
                <Link to="/admin/orders" className="orders-back">← Всички поръчки</Link>

                <div className="order-details-title">
                    <div className="order-details-heading">
                        <h2>Поръчка {formatOrderNumber(order.number)}</h2>
                        <span className={statusClass(order.status)}>
                            {STATUS_LABELS[order.status]}
                        </span>
                    </div>

                    <div className="order-details-heading">
                        <span className="orders-muted">
                            Създадена {formatDateTime(order.createdAt)}
                        </span>
                        <Link to={`/admin/orders/edit/${order.id}`} className="admin-nav-btn">
                            Редактирай
                        </Link>
                    </div>
                </div>
            </div>

            {/* Път на поръчката и следваща стъпка */}
            <section className="orders-card order-progress">
                <ol className={`order-steps ${isCancelled ? 'order-steps--cancelled' : ''}`}>
                    {STATUS_FLOW.map((status, index) => {
                        const isDone = !isCancelled && index < stepIndex;
                        const isCurrent = !isCancelled && index === stepIndex;

                        return (
                            <li
                                key={status}
                                className={`order-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}
                                aria-current={isCurrent ? 'step' : undefined}
                            >
                                <span className="order-step-dot">
                                    {isDone ? <CheckIcon /> : index + 1}
                                </span>
                                <span>{STATUS_LABELS[status]}</span>
                            </li>
                        );
                    })}
                </ol>

                <div className="order-progress-actions">
                    {nextStatus && (
                        <div className="order-next">
                            {needsTracking && (
                                <div className="order-field-inline">
                                    <label htmlFor="trackingNumber">Номер на товарителница</label>
                                    <input
                                        id="trackingNumber"
                                        className="orders-input"
                                        type="text"
                                        maxLength={50}
                                        placeholder="напр. 1051 6024 8833"
                                        value={trackingDraft}
                                        onChange={event => setTrackingDraft(event.target.value)}
                                    />
                                </div>
                            )}

                            <button
                                type="button"
                                className="orders-btn"
                                disabled={isSaving || (needsTracking && !trackingDraft.trim())}
                                onClick={handleNext}
                            >
                                {NEXT_STEP_LABELS[nextStatus]}
                            </button>
                        </div>
                    )}

                    {!nextStatus && (
                        <p className="order-final">
                            {isCancelled ? 'Поръчката е отказана.' : 'Поръчката е доставена.'}
                        </p>
                    )}

                    <div className="order-secondary-actions">
                        {previousStatus && (
                            <button
                                type="button"
                                className="orders-text-btn"
                                disabled={isSaving}
                                onClick={() => run(() => updateOrderStatus(order.id, previousStatus))}
                            >
                                ← Върни на „{STATUS_LABELS[previousStatus]}“
                            </button>
                        )}

                        {!isCancelled && order.status !== 'DELIVERED' && (
                            <button
                                type="button"
                                className="orders-text-btn orders-text-btn--danger"
                                disabled={isSaving}
                                onClick={handleCancel}
                            >
                                Откажи поръчката
                            </button>
                        )}

                        {isCancelled && (
                            <button
                                type="button"
                                className="orders-text-btn"
                                disabled={isSaving}
                                onClick={() => run(() => updateOrderStatus(order.id, statusBeforeCancel))}
                            >
                                Възстанови поръчката
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {error && <p className="orders-message orders-message--error">{error}</p>}

            <div className="order-details-grid">
                <div className="order-details-column">
                    <section className="orders-card order-box">
                        <h3>Продукти</h3>

                        <div className="order-lines">
                            <div className="order-line order-line--head" aria-hidden="true">
                                <span>Продукт</span>
                                <span>Брой</span>
                                <span>Ед. цена</span>
                                <span>Сума</span>
                            </div>

                            {order.items.map(item => (
                                <div className="order-line" key={item.id}>
                                    <span>
                                        {item.product?.slug ? (
                                            <Link to={`/products/${item.product.slug}`} className="order-line-link">
                                                {item.name}
                                            </Link>
                                        ) : (
                                            item.name
                                        )}
                                    </span>
                                    <span>{item.quantity}</span>
                                    <span>{formatMoney(item.unitPrice)}</span>
                                    <span>{formatMoney(item.quantity * Number(item.unitPrice))}</span>
                                </div>
                            ))}
                        </div>

                        <div className="order-total">
                            <span>Общо</span>
                            <strong>{formatMoney(order.total)}</strong>
                        </div>
                    </section>

                    {order.notes && (
                        <section className="orders-card order-box">
                            <h3>Бележка</h3>
                            <p className="order-notes">{order.notes}</p>
                        </section>
                    )}

                    <section className="orders-card order-box">
                        <h3>Клиент</h3>
                        <dl className="order-kv">
                            <dt>Име</dt>
                            <dd>{order.customerName}</dd>
                            <dt>Телефон</dt>
                            <dd>{order.customerPhone}</dd>
                            <dt>Откъде</dt>
                            <dd>{CHANNEL_LABELS[order.channel]}</dd>
                        </dl>
                    </section>
                </div>

                <div className="order-details-column">
                    <section className="orders-card order-box">
                        <h3>Срок</h3>
                        <p>
                            <span className={due.className}>{due.text}</span>
                            {due.date && <span className="orders-muted"> · {formatDate(order.deadline)}</span>}
                        </p>
                    </section>

                    <section className="orders-card order-box">
                        <h3>Доставка</h3>
                        <dl className="order-kv">
                            <dt>Куриер</dt>
                            <dd>{COURIER_LABELS[order.courier]}</dd>
                            {order.courier !== 'PICKUP' && (
                                <>
                                    <dt>Адрес</dt>
                                    <dd>{order.deliveryAddress || '—'}</dd>
                                    <dt>Товарителница</dt>
                                    <dd>{order.trackingNumber ? `№ ${order.trackingNumber}` : 'Още не е изпратена'}</dd>
                                </>
                            )}
                        </dl>
                    </section>

                    <section className="orders-card order-box">
                        <div className="order-box-head">
                            <h3>Плащане</h3>
                            <span className={order.isPaid ? 'order-badge order-badge--paid' : 'order-badge order-badge--unpaid'}>
                                {order.isPaid ? 'Платено' : 'Чака плащане'}
                            </span>
                        </div>
                        <p>{PAYMENT_LABELS[order.paymentMethod]} · {formatMoney(order.total)}</p>
                        <button
                            type="button"
                            className="orders-text-btn"
                            disabled={isSaving}
                            onClick={() => run(() => updateOrderPaid(order.id, !order.isPaid))}
                        >
                            {order.isPaid ? 'Отбележи като неплатена' : 'Отбележи като платена'}
                        </button>
                    </section>

                    <section className="orders-card order-box">
                        <h3>История</h3>
                        <ul className="order-history">
                            {order.history.map(entry => (
                                <li key={entry.id}>
                                    <span className="order-history-dot" />
                                    <div>
                                        <div>{entry.message}</div>
                                        <div className="orders-muted">{formatDateTime(entry.createdAt)}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <button
                        type="button"
                        className="orders-text-btn orders-text-btn--danger order-delete"
                        onClick={handleDelete}
                    >
                        Изтрий поръчката
                    </button>
                </div>
            </div>
        </div>
    );
}
