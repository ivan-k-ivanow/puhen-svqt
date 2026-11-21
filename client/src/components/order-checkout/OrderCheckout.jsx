import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { submitWebsiteOrder } from '../../services/website-orders';
import { getAttribution } from '../../utils/attribution';
import './OrderCheckout.css';

const CONTACT_METHODS = [
    { value: 'CALL', label: 'Обаждане' },
    { value: 'VIBER', label: 'Viber' },
    { value: 'MESSENGER', label: 'Messenger' },
];

const INITIAL_FORM = {
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    contactMethod: 'CALL',
    city: '',
    office: '',
    deadline: '',
    notes: '',
    substitutionConsent: true,
    privacyAccepted: false,
    website: '',
};

function Icon({ children, size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {children}
        </svg>
    );
}

function formatDate(value) {
    const [year, month, day] = value.split('-');
    return `${day}.${month}.${year}`;
}

function validate(form) {
    const errors = {};

    if (form.customerName.trim().length < 2) {
        errors.customerName = 'Въведете име и фамилия.';
    }

        // 0 + 9 цифри (10 общо) или +359 + 9 цифри.
    if (!/^(?:0|\+359)\d{9}$/.test(form.customerPhone.replace(/[\s()-]/g, ''))) {
        errors.customerPhone = 'Въведете телефон с 10 цифри, напр. 0888 123 456.';
    }

    if (form.customerEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail.trim())) {
        errors.customerEmail = 'Въведете валиден имейл.';
    }

    if (form.city.trim().length < 2) {
        errors.city = 'Въведете град.';
    }

    if (form.office.trim().length < 2) {
        errors.office = 'Въведете офис на Еконт.';
    }

    if (!form.privacyAccepted) {
        errors.privacyAccepted = 'Трябва да приемете политиката за поверителност.';
    }

    return errors;
}

function OrderSummary({ product, personalization }) {
    const filled = personalization.filter(entry =>
        entry.field.type === 'PHOTO' ? entry.files.length > 0 : entry.value.trim()
    );

    return (
        <aside className="oc-summary" aria-labelledby="oc-summary-title">
            <h2 id="oc-summary-title" className="oc-summary-title">Вашата поръчка</h2>

            <div className="oc-summary-product">
                {product.image && <img src={product.image} alt="" />}
                <div>
                    <span className="oc-summary-name">{product.name}</span>
                    {product.shortDescription && (
                        <span className="oc-summary-short">{product.shortDescription}</span>
                    )}
                </div>
            </div>

            {filled.length > 0 && (
                <>
                    <dl className="oc-summary-pz">
                        {filled.map(({ field, value, files }) => (
                            <div key={field.id}>
                                <dt>{field.label}</dt>
                                <dd>
                                    {field.type === 'PHOTO' ? (
                                        <span className="oc-photos">
                                            {files.map((file, index) => (
                                                <span className="oc-photo" key={`${file.name}-${index}`}>
                                                    <Icon>
                                                        <rect x="3" y="4" width="18" height="16" rx="2" />
                                                        <circle cx="9" cy="10" r="2" />
                                                        <path d="M21 17l-5-5-9 8" />
                                                    </Icon>
                                                    <span>{file.name}</span>
                                                </span>
                                            ))}
                                        </span>
                                    ) : field.type === 'DATE' ? (
                                        formatDate(value)
                                    ) : (
                                        value
                                    )}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <Link to={`/products/${product.slug}`} className="oc-summary-edit">
                        Промени персонализацията
                    </Link>
                </>
            )}

            <ul className="oc-summary-facts">
                <li>
                    <Icon><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></Icon>
                    Визуализация преди изработка
                </li>
                <li>
                    <Icon><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Icon>
                    Изработка до 7 работни дни
                </li>
                <li>
                    <Icon><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.8" /><circle cx="17.5" cy="18" r="1.8" /></Icon>
                    Доставка с Еконт
                </li>
                <li>
                    <Icon><rect x="2" y="6" width="20" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 10v4M18 10v4" /></Icon>
                    Плащане при получаване
                </li>
            </ul>
        </aside>
    );
}

function Field({ id, label, optional, error, hint, children }) {
    return (
        <div className="oc-field">
            <label htmlFor={id}>
                {label}
                {optional && <span className="oc-optional">по желание</span>}
            </label>
            {children}
            {hint && <p id={`${id}-hint`} className="oc-hint">{hint}</p>}
            {error && <p id={`${id}-error`} className="oc-error">{error}</p>}
        </div>
    );
}

export default function OrderCheckout() {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state;

    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState('');
    const [isSending, setIsSending] = useState(false);

    const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

    if (!order?.product) {
        return (
            <main className="oc-page oc-empty">
                <h1 className="oc-title">Няма избран продукт</h1>
                <p className="oc-subtitle">Изберете продукт, за да направите поръчка.</p>
                <Link to="/products" className="oc-btn">Към продуктите</Link>
            </main>
        );
    }

    const { product, personalization = [] } = order;

    const set = (name) => (event) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setForm(previous => ({ ...previous, [name]: value }));
        setErrors(previous => ({ ...previous, [name]: undefined }));
    };

    const inputProps = (name) => ({
        id: `oc-${name}`,
        value: form[name],
        onChange: set(name),
        'aria-invalid': errors[name] ? true : undefined,
        'aria-describedby': errors[name] ? `oc-${name}-error` : undefined,
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitError('');

        const found = validate(form);
        setErrors(found);

        const firstInvalid = Object.keys(found)[0];

        if (firstInvalid) {
            document.getElementById(`oc-${firstInvalid}`)?.focus();
            return;
        }

        setIsSending(true);

        try {
            const result = await submitWebsiteOrder(
                {
                    productId: product.id,
                    quantity: 1,
                    personalization: Object.fromEntries(
                        personalization
                            .filter(entry => entry.field.type !== 'PHOTO' && entry.value.trim())
                            .map(entry => [entry.field.id, entry.value.trim()])
                    ),
                    customerName: form.customerName.trim(),
                    customerPhone: form.customerPhone.trim(),
                    customerEmail: form.customerEmail.trim(),
                    contactMethod: form.contactMethod,
                    city: form.city.trim(),
                    office: form.office.trim(),
                    deadline: form.deadline,
                    notes: form.notes.trim(),
                    substitutionConsent: form.substitutionConsent,
                    privacyAccepted: form.privacyAccepted,
                    website: form.website,
                    attribution: getAttribution(),
                },
                personalization.flatMap(entry =>
                    entry.field.type === 'PHOTO'
                        ? entry.files.map(file => ({ fieldId: entry.field.id, file }))
                        : []
                )
            );

            navigate('/order/thank-you', {
                replace: true,
                state: {
                    number: result.number,
                    contactMethod: form.contactMethod,
                    productName: product.name,
                },
            });
        } catch (err) {
            setSubmitError(err.message);
            setIsSending(false);
        }
    };

    return (
        <main className="oc-page">
            <Link to={`/products/${product.slug}`} className="oc-back">
                <Icon><path d="M19 12H5M11 6l-6 6 6 6" /></Icon>
                Обратно към продукта
            </Link>

            <div className="oc-head">
                <h1 className="oc-title">Завършете поръчката</h1>
                <p className="oc-subtitle">Попълнете данните си – ще се свържем с вас, преди да започнем изработката.</p>
            </div>

            <div className="oc-layout">
                <form className="oc-form" onSubmit={handleSubmit} noValidate>
                    <fieldset className="oc-group">
                        <legend><span className="oc-num">1</span>Данни за контакт</legend>

                        <div className="oc-row">
                            <Field id="oc-customerName" label="Име и фамилия" error={errors.customerName}>
                                <input className="oc-input" autoComplete="name" placeholder="Мария Иванова" maxLength={100} {...inputProps('customerName')} />
                            </Field>
                            <Field id="oc-customerPhone" label="Телефон" error={errors.customerPhone}>
                                <input className="oc-input" type="tel" autoComplete="tel" placeholder="0888 123 456" maxLength={30} {...inputProps('customerPhone')} />
                            </Field>
                        </div>

                        <Field id="oc-customerEmail" label="Имейл" optional error={errors.customerEmail}>
                            <input className="oc-input" type="email" autoComplete="email" placeholder="maria@example.com" maxLength={150} {...inputProps('customerEmail')} />
                        </Field>

                        <div className="oc-field">
                            <span className="oc-label" id="oc-contact-label">Как предпочитате да се свържем с вас?</span>
                            <div className="oc-segs" role="radiogroup" aria-labelledby="oc-contact-label">
                                {CONTACT_METHODS.map(method => (
                                    <label className="oc-seg" key={method.value}>
                                        <input
                                            type="radio"
                                            className="sr-only"
                                            name="contactMethod"
                                            value={method.value}
                                            checked={form.contactMethod === method.value}
                                            onChange={set('contactMethod')}
                                        />
                                        <span>{method.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="oc-group">
                        <legend><span className="oc-num">2</span>Доставка с Еконт</legend>

                        <div className="oc-row">
                            <Field id="oc-city" label="Град" error={errors.city}>
                                <input className="oc-input" autoComplete="address-level2" placeholder="София" maxLength={80} {...inputProps('city')} />
                            </Field>
                            <Field id="oc-office" label="Офис на Еконт" error={errors.office}>
                                <input className="oc-input" placeholder="напр. Еконт – Младост 1" maxLength={150} {...inputProps('office')} />
                            </Field>
                        </div>

                        <Field id="oc-deadline" label="Дата на повода" optional hint="Ако подаръкът ви трябва за конкретна дата – ще съобразим изработката.">
                            <input className="oc-input oc-date" type="date" min={today} {...inputProps('deadline')} aria-describedby="oc-deadline-hint" />
                        </Field>

                        <Field id="oc-notes" label="Бележка към поръчката" optional>
                            <textarea className="oc-input oc-area" rows={3} maxLength={1000} placeholder="Нещо, което трябва да знаем" {...inputProps('notes')} />
                        </Field>
                    </fieldset>

                    {/* Скрито поле срещу ботове */}
                    <div className="oc-trap" aria-hidden="true">
                        <label htmlFor="oc-website">Уебсайт</label>
                        <input id="oc-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
                    </div>

                    <div className="oc-consents">
                        <label className="oc-check">
                            <input type="checkbox" checked={form.substitutionConsent} onChange={set('substitutionConsent')} />
                            <span>Ако избран цвят или материал не е наличен, съгласен/на съм да го заменим с най-близкия. Ще ви изпратим снимка преди изпращане.</span>
                        </label>

                        <label className="oc-check">
                            <input
                                id="oc-privacyAccepted"
                                type="checkbox"
                                checked={form.privacyAccepted}
                                onChange={set('privacyAccepted')}
                                aria-invalid={errors.privacyAccepted ? true : undefined}
                                aria-describedby={errors.privacyAccepted ? 'oc-privacyAccepted-error' : undefined}
                            />
                            <span>
                                Съгласен/на съм с <a href="/privacy" target="_blank" rel="noopener noreferrer">Политиката за поверителност</a>.
                                <span className="oc-required" aria-hidden="true"> *</span>
                            </span>
                        </label>
                        {errors.privacyAccepted && (
                            <p id="oc-privacyAccepted-error" className="oc-error">{errors.privacyAccepted}</p>
                        )}
                    </div>

                    <div className="oc-submit">
                        {submitError && <p className="oc-submit-error" role="alert">{submitError}</p>}

                        <button type="submit" className="oc-btn" disabled={isSending}>
                            {isSending ? 'Изпращане…' : 'Изпрати заявката'}
                            {!isSending && <Icon size={18}><path d="M5 12h14M13 6l6 6-6 6" /></Icon>}
                        </button>
                        <p className="oc-submit-note">Плащате с наложен платеж при получаване. Ще се свържем с вас, за да потвърдим детайлите.</p>
                        <p className="oc-secure">
                            <Icon size={14}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></Icon>
                            Данните ви се използват само за тази поръчка.
                        </p>
                    </div>
                </form>

                <div className="oc-summary-wrap">
                    <OrderSummary product={product} personalization={personalization} />
                </div>
            </div>
        </main>
    );
}
