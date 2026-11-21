import { useEffect, useMemo, useState } from 'react';
import { compressImage } from '../../../utils/compress-image';
import './PersonalizationForm.css';

function PhotoThumb({ file, onRemove }) {
    const url = useMemo(() => URL.createObjectURL(file), [file]);

    useEffect(() => () => URL.revokeObjectURL(url), [url]);

    return (
        <div className="pz-thumb">
            <img src={url} alt={file.name} />
            <button type="button" className="pz-thumb-remove" aria-label={`Премахни ${file.name}`} onClick={onRemove}>
                ×
            </button>
        </div>
    );
}

function PhotoField({ field, id, files, onChange, describedBy, invalid }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const max = field.maxFiles ?? 1;
    const canAdd = files.length < max;

    const handleSelect = async (event) => {
        const selected = Array.from(event.target.files ?? []).slice(0, max - files.length);
        event.target.value = '';

        if (selected.length === 0) {
            return;
        }

        setIsProcessing(true);

        try {
            // Една по една, за да не задавим паметта на по-слаб телефон.
            const compressed = [];

            for (const file of selected) {
                compressed.push(await compressImage(file));
            }

            onChange([...files, ...compressed].slice(0, max));
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>
            {files.length > 0 && (
                <div className="pz-thumbs">
                    {files.map((file, index) => (
                        <PhotoThumb
                            key={`${file.name}-${file.size}-${index}`}
                            file={file}
                            onRemove={() => onChange(files.filter((_, i) => i !== index))}
                        />
                    ))}
                </div>
            )}

            {canAdd && (
                <label className={`pz-drop ${invalid ? 'is-invalid' : ''} ${isProcessing ? 'is-busy' : ''}`} htmlFor={id}>
                    <span className="pz-drop-icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
                            <circle cx="12" cy="13" r="3.5" />
                        </svg>
                    </span>
                    <span className="pz-drop-main">
                        {isProcessing
                            ? 'Подготвяме снимките…'
                            : files.length === 0 ? (max > 1 ? 'Качи снимки' : 'Качи снимка') : 'Добави още снимка'}
                    </span>
                    <span className="pz-drop-sub">
                        JPG или PNG, до 10 MB{max > 1 ? ` · ${files.length} от ${max}` : ''}
                    </span>
                </label>
            )}

            <input
                id={id}
                className="sr-only"
                type="file"
                accept="image/*"
                multiple={max > 1}
                aria-describedby={describedBy}
                aria-invalid={invalid || undefined}
                disabled={!canAdd || isProcessing}
                onChange={handleSelect}
            />
        </>
    );
}

// Полетата за персонализация на страницата на продукта.
export default function PersonalizationForm({ fields, values, files, errors, onValueChange, onFilesChange }) {
    return fields.map(field => {
        const id = `pz-${field.id}`;
        const hintId = field.hint ? `${id}-hint` : undefined;
        const errorId = errors[field.id] ? `${id}-error` : undefined;
        const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
        const invalid = Boolean(errors[field.id]);
        const value = values[field.id] ?? '';

        return (
            <div className="pz-field" key={field.id}>
                <div className="pz-field-top">
                    {field.type === 'CHOICE' ? (
                        <span className="pz-label" id={`${id}-label`}>{field.label}</span>
                    ) : (
                        <label className="pz-label" htmlFor={id}>{field.label}</label>
                    )}
                    {!field.required && <span className="pz-optional">по желание</span>}
                </div>

                {field.hint && <p id={hintId} className="pz-hint">{field.hint}</p>}

                {field.type === 'PHOTO' && (
                    <PhotoField
                        field={field}
                        id={id}
                        files={files[field.id] ?? []}
                        onChange={(list) => onFilesChange(field.id, list)}
                        describedBy={describedBy}
                        invalid={invalid}
                    />
                )}

                {field.type === 'TEXT' && (
                    <input
                        id={id}
                        className="pz-input"
                        type="text"
                        value={value}
                        maxLength={field.maxLength ?? undefined}
                        placeholder={field.placeholder ?? ''}
                        aria-describedby={describedBy}
                        aria-invalid={invalid || undefined}
                        onChange={(event) => onValueChange(field.id, event.target.value)}
                    />
                )}

                {field.type === 'TEXTAREA' && (
                    <textarea
                        id={id}
                        className="pz-input pz-area"
                        rows={3}
                        value={value}
                        maxLength={field.maxLength ?? undefined}
                        placeholder={field.placeholder ?? ''}
                        aria-describedby={describedBy}
                        aria-invalid={invalid || undefined}
                        onChange={(event) => onValueChange(field.id, event.target.value)}
                    />
                )}

                {field.type === 'DATE' && (
                    <input
                        id={id}
                        className="pz-input pz-date"
                        type="date"
                        value={value}
                        aria-describedby={describedBy}
                        aria-invalid={invalid || undefined}
                        onChange={(event) => onValueChange(field.id, event.target.value)}
                    />
                )}

                {field.type === 'CHOICE' && (
                    <div className="pz-choices" role="radiogroup" aria-labelledby={`${id}-label`} aria-describedby={describedBy}>
                        {field.options.map((option, index) => (
                            <label className="pz-choice" key={option}>
                                <input
                                    id={index === 0 ? id : undefined}
                                    type="radio"
                                    className="sr-only"
                                    name={id}
                                    value={option}
                                    checked={value === option}
                                    onChange={() => onValueChange(field.id, option)}
                                />
                                <span>{option}</span>
                            </label>
                        ))}
                    </div>
                )}

                {(field.type === 'TEXT' || field.type === 'TEXTAREA') && field.maxLength && (
                    <span className="pz-count" aria-live="polite">{value.length} / {field.maxLength}</span>
                )}

                {invalid && <p id={errorId} className="pz-error">{errors[field.id]}</p>}
            </div>
        );
    });
}
