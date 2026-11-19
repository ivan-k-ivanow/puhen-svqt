import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { getProducts } from '../../../../services/products';
import { createOrder, updateOrder } from '../../../../services/orders';
import {
    STATUSES,
    STATUS_LABELS,
    CHANNEL_LABELS,
    COURIER_LABELS,
    PAYMENT_LABELS,
    formatOrderNumber,
    formatMoney,
    toDateInput,
} from '../../../../utils/orders';
import '../orders.css';
import './OrderForm.css';

const CUSTOM_PRODUCT = 'custom';

let nextKey = 1;

function emptyItem() {
    return { key: nextKey++, productId: '', isCustom: false, name: '', quantity: 1, unitPrice: '' };
}

function itemFromOrder(item) {
    return {
        key: nextKey++,
        productId: item.productId || '',
        isCustom: !item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: String(Number(item.unitPrice)),
    };
}

function toNumber(value) {
    const number = parseFloat(String(value).replace(',', '.'));
    return Number.isFinite(number) ? number : 0;
}

function ChoicePills({ label, options, value, onChange }) {
    return (
        <div className="orders-pills" role="group" aria-label={label}>
            {Object.entries(options).map(([optionValue, optionLabel]) => (
                <button
                    type="button"
                    key={optionValue}
                    className={`orders-pill ${value === optionValue ? 'active' : ''}`}
                    aria-pressed={value === optionValue}
                    onClick={() => onChange(optionValue)}
                >
                    {optionLabel}
                </button>
            ))}
        </div>
    );
}

// Без `order` е форма за нова поръчка, с `order` – за редакция.
export default function OrderForm({ order }) {
    const navigate = useNavigate();
    const isEdit = Boolean(order);

    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(() => ({
        customerName: order?.customerName ?? '',
        customerPhone: order?.customerPhone ?? '',
        channel: order?.channel ?? 'INSTAGRAM',
        courier: order?.courier ?? 'ECONT',
        deliveryAddress: order?.deliveryAddress ?? '',
        paymentMethod: order?.paymentMethod ?? 'CASH_ON_DELIVERY',
        deadline: toDateInput(order?.deadline),
        notes: order?.notes ?? '',
        status: order?.status ?? 'NEW',
        trackingNumber: order?.trackingNumber ?? '',
        isPaid: order?.isPaid ?? false,
    }));
    const [items, setItems] = useState(() =>
        order?.items?.length ? order.items.map(itemFromOrder) : [emptyItem()]
    );
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        getProducts()
            .then(setProducts)
            .catch(err => setError(err.message));
    }, []);

    const setField = (field, value) => {
        setForm(current => ({ ...current, [field]: value }));
    };

    const setItem = (key, patch) => {
        setItems(current =>
            current.map(item => (item.key === key ? { ...item, ...patch } : item))
        );
    };

    const handleProductChange = (item, value) => {
        if (value === CUSTOM_PRODUCT) {
            setItem(item.key, { productId: '', isCustom: true, name: '' });
            return;
        }

        const product = products.find(p => p.id === value);

        setItem(item.key, {
            productId: value,
            isCustom: false,
            name: product?.name ?? '',
            // Цената се попълва от продукта, но може да се промени.
            unitPrice: product ? String(Number(product.price)) : item.unitPrice,
        });
    };

    // Продукт от стара поръчка, който вече не е в каталога.
    const missingProducts = items.filter(
        item => item.productId && !products.some(product => product.id === item.productId)
    );

    const total = items.reduce(
        (sum, item) => sum + toNumber(item.quantity) * toNumber(item.unitPrice),
        0
    );

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        const payload = {
            ...form,
            deliveryAddress: form.courier === 'PICKUP' ? '' : form.deliveryAddress,
            items: items
                .filter(item => item.name.trim())
                .map(item => ({
                    productId: item.productId || null,
                    name: item.name.trim(),
                    quantity: toNumber(item.quantity),
                    unitPrice: toNumber(item.unitPrice),
                })),
        };

        if (!isEdit) {
            delete payload.status;
            delete payload.trackingNumber;
            delete payload.isPaid;
        }

        if (payload.items.length === 0) {
            setError('Добавете поне един продукт.');
            return;
        }

        setIsSaving(true);

        try {
            const saved = isEdit
                ? await updateOrder(order.id, payload)
                : await createOrder(payload);

            navigate(`/admin/orders/${saved.id}`);
        } catch (err) {
            setError(err.message);
            setIsSaving(false);
        }
    };

    const backLink = isEdit ? `/admin/orders/${order.id}` : '/admin/orders';

    return (
        <div className="orders-page order-form-page">
            <div>
                <Link to={backLink} className="orders-back">
                    ← {isEdit ? 'Обратно към поръчката' : 'Всички поръчки'}
                </Link>
                <h2>
                    {isEdit ? `Редакция на ${formatOrderNumber(order.number)}` : 'Нова поръчка'}
                </h2>
            </div>

            <form className="orders-card order-form" onSubmit={handleSubmit}>
                <section className="order-form-section">
                    <h3>Клиент</h3>

                    <div className="order-form-grid order-form-grid--2">
                        <div className="order-field">
                            <label htmlFor="customerName">
                                Име <span className="order-required">*</span>
                            </label>
                            <input
                                id="customerName"
                                className="orders-input"
                                type="text"
                                required
                                maxLength={100}
                                placeholder="Име и фамилия"
                                value={form.customerName}
                                onChange={event => setField('customerName', event.target.value)}
                            />
                        </div>

                        <div className="order-field">
                            <label htmlFor="customerPhone">
                                Телефон <span className="order-required">*</span>
                            </label>
                            <input
                                id="customerPhone"
                                className="orders-input"
                                type="tel"
                                required
                                maxLength={30}
                                placeholder="08X XXX XXXX"
                                value={form.customerPhone}
                                onChange={event => setField('customerPhone', event.target.value)}
                            />
                        </div>
                    </div>

                    <ChoicePills
                        label="Откъде дойде поръчката"
                        options={CHANNEL_LABELS}
                        value={form.channel}
                        onChange={value => setField('channel', value)}
                    />
                </section>

                <section className="order-form-section">
                    <h3>Продукти</h3>

                    <div className="order-item order-item--head" aria-hidden="true">
                        <span>Продукт</span>
                        <span>Брой</span>
                        <span>Цена €</span>
                        <span />
                    </div>

                    {items.map(item => (
                        <div className="order-item-block" key={item.key}>
                            <div className="order-item">
                                <label htmlFor={`product-${item.key}`} className="visually-hidden">
                                    Продукт
                                </label>
                                <select
                                    id={`product-${item.key}`}
                                    className="orders-input"
                                    value={item.isCustom ? CUSTOM_PRODUCT : item.productId}
                                    onChange={event => handleProductChange(item, event.target.value)}
                                >
                                    <option value="">Избери продукт</option>
                                    {products.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.name}
                                        </option>
                                    ))}
                                    {missingProducts.map(missing => (
                                        <option key={missing.productId} value={missing.productId}>
                                            {missing.name}
                                        </option>
                                    ))}
                                    <option value={CUSTOM_PRODUCT}>Друго (по поръчка)</option>
                                </select>

                                <label htmlFor={`quantity-${item.key}`} className="visually-hidden">
                                    Брой
                                </label>
                                <input
                                    id={`quantity-${item.key}`}
                                    className="orders-input"
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={event => setItem(item.key, { quantity: event.target.value })}
                                />

                                <label htmlFor={`price-${item.key}`} className="visually-hidden">
                                    Цена
                                </label>
                                <input
                                    id={`price-${item.key}`}
                                    className="orders-input"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={item.unitPrice}
                                    onChange={event => setItem(item.key, { unitPrice: event.target.value })}
                                />

                                <button
                                    type="button"
                                    className="order-item-remove"
                                    aria-label="Премахни продукта"
                                    disabled={items.length === 1}
                                    onClick={() =>
                                        setItems(current => current.filter(x => x.key !== item.key))
                                    }
                                >
                                    ×
                                </button>
                            </div>

                            {item.isCustom && (
                                <div className="order-field">
                                    <label htmlFor={`custom-${item.key}`}>Какво е поръчано</label>
                                    <input
                                        id={`custom-${item.key}`}
                                        className="orders-input"
                                        type="text"
                                        maxLength={150}
                                        placeholder="напр. Букет в синьо с плюшено зайче"
                                        value={item.name}
                                        onChange={event => setItem(item.key, { name: event.target.value })}
                                    />
                                </div>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        className="orders-text-btn order-add-item"
                        onClick={() => setItems(current => [...current, emptyItem()])}
                    >
                        + Добави продукт
                    </button>
                </section>

                <section className="order-form-section">
                    <h3>Доставка и плащане</h3>

                    <ChoicePills
                        label="Куриер"
                        options={COURIER_LABELS}
                        value={form.courier}
                        onChange={value => setField('courier', value)}
                    />

                    {form.courier !== 'PICKUP' && (
                        <div className="order-field">
                            <label htmlFor="deliveryAddress">Град и офис или адрес</label>
                            <input
                                id="deliveryAddress"
                                className="orders-input"
                                type="text"
                                maxLength={300}
                                placeholder="напр. София, офис Еконт Лозенец"
                                value={form.deliveryAddress}
                                onChange={event => setField('deliveryAddress', event.target.value)}
                            />
                        </div>
                    )}

                    <ChoicePills
                        label="Плащане"
                        options={PAYMENT_LABELS}
                        value={form.paymentMethod}
                        onChange={value => setField('paymentMethod', value)}
                    />
                </section>

                <section className="order-form-section">
                    <div className="order-form-grid order-form-grid--deadline">
                        <div className="order-field">
                            <label htmlFor="deadline">Краен срок</label>
                            <input
                                id="deadline"
                                className="orders-input"
                                type="date"
                                value={form.deadline}
                                onChange={event => setField('deadline', event.target.value)}
                            />
                        </div>

                        <div className="order-field">
                            <label htmlFor="notes">Бележка</label>
                            <textarea
                                id="notes"
                                className="orders-input"
                                rows={3}
                                maxLength={2000}
                                placeholder="Персонализация, цветове, надпис на картичката…"
                                value={form.notes}
                                onChange={event => setField('notes', event.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {isEdit && (
                    <section className="order-form-section">
                        <h3>Статус и проследяване</h3>

                        <div className="order-form-grid order-form-grid--2">
                            <div className="order-field">
                                <label htmlFor="status">Статус</label>
                                <select
                                    id="status"
                                    className="orders-input"
                                    value={form.status}
                                    onChange={event => setField('status', event.target.value)}
                                >
                                    {STATUSES.map(status => (
                                        <option key={status} value={status}>
                                            {STATUS_LABELS[status]}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="order-field">
                                <label htmlFor="trackingNumber">Номер на товарителница</label>
                                <input
                                    id="trackingNumber"
                                    className="orders-input"
                                    type="text"
                                    maxLength={50}
                                    value={form.trackingNumber}
                                    onChange={event => setField('trackingNumber', event.target.value)}
                                />
                            </div>
                        </div>

                        <label className="order-check">
                            <input
                                type="checkbox"
                                checked={form.isPaid}
                                onChange={event => setField('isPaid', event.target.checked)}
                            />
                            Платено
                        </label>
                    </section>
                )}

                {error && <p className="orders-message orders-message--error">{error}</p>}

                <div className="order-form-footer">
                    <div className="order-form-total">
                        <span>Общо</span>
                        <strong>{formatMoney(total)}</strong>
                    </div>

                    <div className="order-form-actions">
                        <Link to={backLink} className="admin-nav-btn order-cancel">
                            Отказ
                        </Link>
                        <button type="submit" className="orders-btn" disabled={isSaving}>
                            {isSaving ? 'Запазване...' : 'Запази поръчката'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
