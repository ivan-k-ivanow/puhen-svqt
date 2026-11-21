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
    CONTACT_METHOD_LABELS,
    phoneToInternational,
    attributionLabel,
} from '../../../../utils/orders';
import '../orders.css';
import './OrderDetails.css';

function Icon({ children, size = 14 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {children}
        </svg>
    );
}

function CopyButton({ text }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // Браузърът не позволява копиране – нищо не правим.
        }
    };

    return (
        <button type="button" className="order-mini-btn" onClick={handleCopy}>
            <Icon><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a1 1 0 0 1 1-1h10" /></Icon>
            {copied ? 'Копирано' : 'Копирай'}
        </button>
    );
}

// Попълнената от клиента персонализация към един продукт.
function ItemPersonalization({ personalization }) {
    return (
        <div className="order-pz">
            <p className="order-pz-title">Персонализация</p>

            {personalization.map((entry, index) => (
                <div className="order-pz-row" key={entry.fieldId ?? index}>
                    <span className="order-pz-label">
                        {entry.label}
                        {entry.type === 'PHOTO' && Array.isArray(entry.value) && entry.value.length > 0 && ` · ${entry.value.length}`}
                    </span>

                    {entry.type === 'PHOTO' ? (
                        entry.deleted ? (
                            <span className="orders-muted">Снимките са изтрити автоматично.</span>
                        ) : (
                            <div className="order-pz-photos">
                                {entry.value.map((photo, photoIndex) => (
                                    <div className="order-pz-photo" key={photo.path ?? photoIndex}>
                                        {photo.url ? (
                                            <a href={photo.url} target="_blank" rel="noopener noreferrer" className="order-pz-thumb">
                                                <img src={photo.url} alt={photo.name || `Снимка ${photoIndex + 1}`} />
                                            </a>
                                        ) : (
                                            <span className="order-pz-thumb order-pz-thumb--missing">Няма достъп</span>
                                        )}
                                        <span className="order-pz-name">{photo.name}</span>
                                        {photo.downloadUrl && (
                                            <a href={photo.downloadUrl} className="order-mini-btn">
                                                <Icon><path d="M12 4v11M7 10l5 5 5-5" /><path d="M5 20h14" /></Icon>
                                                Изтегли
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )
                    ) : (
                        <div className="order-pz-text">
                            <span className="order-pz-value">
                                {entry.type === 'DATE' ? formatDate(entry.value) : entry.value}
                            </span>
                            <CopyButton text={String(entry.value)} />
                        </div>
                    )}
                </div>
            ))}

            {personalization.some(entry => entry.type === 'PHOTO' && !entry.deleted) && (
                <p className="order-pz-note">
                    <Icon><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>
                    Снимките се изтриват 30 дни след доставка.
                </p>
            )}
        </div>
    );
}

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
    const isWebsite = order.channel === 'WEBSITE';
    const hasNoPrice = Number(order.total) === 0;
    const phone = phoneToInternational(order.customerPhone);
    const source = attributionLabel(order.attribution);

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
                        {isWebsite && <span className="order-source-badge">Сайт</span>}
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
                                    <span>{Number(item.unitPrice) === 0 && isWebsite ? '—' : formatMoney(item.unitPrice)}</span>
                                    <span>{Number(item.unitPrice) === 0 && isWebsite ? '—' : formatMoney(item.quantity * Number(item.unitPrice))}</span>

                                    {item.personalization?.length > 0 && (
                                        <ItemPersonalization personalization={item.personalization} />
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="order-total">
                            <span>Общо</span>
                            {isWebsite && hasNoPrice ? (
                                <span className="order-total-missing">Въвежда се при потвърждаване</span>
                            ) : (
                                <strong>{formatMoney(order.total)}</strong>
                            )}
                        </div>
                    </section>

                    {order.notes && (
                        <section className="orders-card order-box">
                            <h3>{isWebsite ? 'Бележка от клиента' : 'Бележка'}</h3>
                            <p className="order-notes">{order.notes}</p>
                        </section>
                    )}

                </div>

                <div className="order-details-column">
                    <section className="orders-card order-box">
                        <h3>Клиент</h3>
                        <dl className="order-kv">
                            <dt>Име</dt>
                            <dd>{order.customerName}</dd>
                            <dt>Телефон</dt>
                            <dd>
                                {order.customerPhone}
                                <span className="order-contact-actions">
                                    <a className="order-mini-btn" href={`tel:${phone}`}>
                                        <Icon><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></Icon>
                                        Обади се
                                    </a>
                                    <a className="order-mini-btn" href={`viber://chat?number=${encodeURIComponent(phone)}`}>
                                        <Icon><path d="M4 5h16v11H8l-4 4z" /></Icon>
                                        Viber
                                    </a>
                                </span>
                            </dd>
                            {order.customerEmail && (
                                <>
                                    <dt>Имейл</dt>
                                    <dd><a href={`mailto:${order.customerEmail}`} className="order-line-link">{order.customerEmail}</a></dd>
                                </>
                            )}
                            {order.contactMethod && (
                                <>
                                    <dt>Връзка</dt>
                                    <dd><span className="order-pref">Предпочита {CONTACT_METHOD_LABELS[order.contactMethod]}</span></dd>
                                </>
                            )}
                            <dt>Откъде</dt>
                            <dd>{CHANNEL_LABELS[order.channel]}{source && ` · ${source}`}</dd>
                        </dl>
                    </section>

                    <section className="orders-card order-box">
                        <h3>Срок</h3>
                        <p>
                            <span className={due.className}>{due.text}</span>
                            {due.date && <span className="orders-muted"> · {formatDate(order.deadline)}</span>}
                            {isWebsite && order.deadline && <span className="orders-muted"> (дата на повода)</span>}
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
                        <p>
                            {PAYMENT_LABELS[order.paymentMethod]}
                            {' · '}
                            {isWebsite && hasNoPrice ? 'сумата се въвежда при потвърждаване' : formatMoney(order.total)}
                        </p>
                        <button
                            type="button"
                            className="orders-text-btn"
                            disabled={isSaving}
                            onClick={() => run(() => updateOrderPaid(order.id, !order.isPaid))}
                        >
                            {order.isPaid ? 'Отбележи като неплатена' : 'Отбележи като платена'}
                        </button>
                    </section>

                    {isWebsite && (
                        <section className="orders-card order-box">
                            <h3>Съгласия</h3>
                            <ul className="order-consents">
                                <li className={order.substitutionConsent ? '' : 'is-no'}>
                                    <Icon size={16}>{order.substitutionConsent ? <path d="M5 12l5 5 9-10" /> : <path d="M6 6l12 12M18 6L6 18" />}</Icon>
                                    <span>
                                        {order.substitutionConsent
                                            ? 'Съгласен/на е със замяна на цвят или материал, ако не е наличен'
                                            : 'Не е съгласен/на със замяна на цвят или материал'}
                                    </span>
                                </li>
                                {order.privacyAcceptedAt && (
                                    <li>
                                        <Icon size={16}><path d="M5 12l5 5 9-10" /></Icon>
                                        <span>
                                            Политика за поверителност
                                            <span className="orders-muted order-consent-date">Приета на {formatDateTime(order.privacyAcceptedAt)}</span>
                                        </span>
                                    </li>
                                )}
                            </ul>
                        </section>
                    )}

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
