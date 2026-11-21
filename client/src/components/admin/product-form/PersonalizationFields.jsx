import './PersonalizationFields.css';

import { FIELD_TYPES, newField } from './personalization-fields';

const TYPE_LABELS = Object.fromEntries(FIELD_TYPES.map(({ type, label }) => [type, label]));
const TYPE_EXAMPLES = Object.fromEntries(FIELD_TYPES.map(({ type, example }) => [type, example]));

function Icon({ type, size = 14 }) {
    const paths = {
        PHOTO: <><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></>,
        TEXT: <path d="M4 7V5h16v2M12 5v14M9 19h6" />,
        TEXTAREA: <path d="M4 6h16M4 10h16M4 14h10M4 18h7" />,
        DATE: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>,
        CHOICE: <><circle cx="5" cy="7" r="1.5" /><circle cx="5" cy="12" r="1.5" /><circle cx="5" cy="17" r="1.5" /><path d="M10 7h10M10 12h10M10 17h10" /></>,
        UP: <path d="M12 19V5M6 11l6-6 6 6" />,
        DOWN: <path d="M12 5v14M6 13l6 6 6-6" />,
        REMOVE: <path d="M6 6l12 12M18 6L6 18" />,
        PLUS: <path d="M12 5v14M5 12h14" />,
    };

    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {paths[type]}
        </svg>
    );
}

// Секция „Персонализация“ във формата за продукт.
// Входовете нямат name, за да не влизат в FormData на формата –
// полетата се изпращат отделно като JSON.
export default function PersonalizationFields({ fields, onChange }) {
    const update = (key, patch) => {
        onChange(fields.map(field => (field.key === key ? { ...field, ...patch } : field)));
    };

    const move = (index, direction) => {
        const target = index + direction;

        if (target < 0 || target >= fields.length) {
            return;
        }

        const list = [...fields];
        [list[index], list[target]] = [list[target], list[index]];
        onChange(list);
    };

    return (
        <div className="pz-admin">
            <h3>Персонализация</h3>
            <p className="pz-admin-lead">
                Полета, които клиентът попълва при поръчка. Ако продуктът не се персонализира, не добавяй полета.
            </p>

            {fields.length === 0 && (
                <p className="pz-admin-empty">
                    Няма полета за персонализация – клиентът ще вижда само бутона за поръчка.
                </p>
            )}

            {fields.map((field, index) => {
                const id = `pf-${field.key}`;
                const isText = field.type === 'TEXT' || field.type === 'TEXTAREA';

                return (
                    <div className="pz-admin-card" key={field.key}>
                        <div className="pz-admin-top">
                            <span className="pz-admin-type">
                                <Icon type={field.type} />
                                {TYPE_LABELS[field.type]}
                            </span>

                            <div className="pz-admin-actions">
                                <button type="button" aria-label="Премести нагоре" disabled={index === 0} onClick={() => move(index, -1)}>
                                    <Icon type="UP" size={16} />
                                </button>
                                <button type="button" aria-label="Премести надолу" disabled={index === fields.length - 1} onClick={() => move(index, 1)}>
                                    <Icon type="DOWN" size={16} />
                                </button>
                                <button type="button" aria-label="Премахни полето" onClick={() => onChange(fields.filter(item => item.key !== field.key))}>
                                    <Icon type="REMOVE" size={16} />
                                </button>
                            </div>
                        </div>

                        <label className="pz-admin-label" htmlFor={`${id}-label`}>Заглавие</label>
                        <input
                            id={`${id}-label`}
                            value={field.label}
                            maxLength={80}
                            required
                            placeholder={TYPE_EXAMPLES[field.type]}
                            onChange={event => update(field.key, { label: event.target.value })}
                        />

                        <label className="pz-admin-label" htmlFor={`${id}-hint`}>
                            Описание <span>(по желание)</span>
                        </label>
                        <input
                            id={`${id}-hint`}
                            value={field.hint}
                            maxLength={300}
                            placeholder="Кратко обяснение за клиента"
                            onChange={event => update(field.key, { hint: event.target.value })}
                        />

                        {isText && (
                            <div className="pz-admin-row">
                                <div>
                                    <label className="pz-admin-label" htmlFor={`${id}-placeholder`}>
                                        Пример <span>(по желание)</span>
                                    </label>
                                    <input
                                        id={`${id}-placeholder`}
                                        value={field.placeholder}
                                        maxLength={100}
                                        placeholder="напр. Семейство Иванови"
                                        onChange={event => update(field.key, { placeholder: event.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="pz-admin-label" htmlFor={`${id}-max`}>Макс. символи</label>
                                    <input
                                        id={`${id}-max`}
                                        type="number"
                                        min="1"
                                        max="2000"
                                        value={field.maxLength}
                                        onChange={event => update(field.key, { maxLength: event.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {field.type === 'PHOTO' && (
                            <div className="pz-admin-small">
                                <label className="pz-admin-label" htmlFor={`${id}-files`}>Макс. брой снимки</label>
                                <input
                                    id={`${id}-files`}
                                    type="number"
                                    min="1"
                                    max="10"
                                    value={field.maxFiles}
                                    onChange={event => update(field.key, { maxFiles: event.target.value })}
                                />
                            </div>
                        )}

                        {field.type === 'CHOICE' && (
                            <>
                                <label className="pz-admin-label" htmlFor={`${id}-options`}>
                                    Варианти <span>(разделени със запетая)</span>
                                </label>
                                <input
                                    id={`${id}-options`}
                                    value={field.options}
                                    placeholder="напр. Златно, Сребърно"
                                    onChange={event => update(field.key, { options: event.target.value })}
                                />
                            </>
                        )}

                        <label className="pz-admin-check">
                            <input
                                type="checkbox"
                                checked={field.required}
                                onChange={event => update(field.key, { required: event.target.checked })}
                            />
                            Задължително поле
                        </label>
                    </div>
                );
            })}

            <div className="pz-admin-add">
                <span><Icon type="PLUS" />Добави поле:</span>
                {FIELD_TYPES.map(({ type, label }) => (
                    <button
                        type="button"
                        key={type}
                        className="pz-admin-type-btn"
                        onClick={() => onChange([...fields, newField(type)])}
                    >
                        <Icon type={type} />
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}
