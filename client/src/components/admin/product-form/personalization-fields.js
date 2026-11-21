// Помощни функции за полетата за персонализация във формата за продукт.

export const FIELD_TYPES = [
    { type: 'PHOTO', label: 'Снимка', example: 'напр. Снимки за фигурките' },
    { type: 'TEXT', label: 'Кратък текст', example: 'напр. Текст на табелката' },
    { type: 'TEXTAREA', label: 'Дълъг текст', example: 'напр. Пожелание в картичката' },
    { type: 'DATE', label: 'Дата', example: 'напр. Дата на сватбата' },
    { type: 'CHOICE', label: 'Избор', example: 'напр. Цвят на панделката' },
];

let nextKey = 1;

// Полетата от сървъра -> състояние на формата.
export function fieldsFromProduct(fields = []) {
    return fields.map(field => ({
        key: nextKey++,
        type: field.type,
        label: field.label ?? '',
        hint: field.hint ?? '',
        placeholder: field.placeholder ?? '',
        required: field.required ?? true,
        maxLength: field.maxLength ?? '',
        maxFiles: field.maxFiles ?? 1,
        options: (field.options ?? []).join(', '),
    }));
}

// Състояние на формата -> JSON за сървъра.
export function fieldsToPayload(fields) {
    return fields.map(field => ({
        type: field.type,
        label: field.label.trim(),
        hint: field.hint.trim() || null,
        placeholder: field.placeholder.trim() || null,
        required: field.required,
        maxLength: field.maxLength === '' ? null : Number(field.maxLength),
        maxFiles: field.maxFiles === '' ? null : Number(field.maxFiles),
        options: field.options
            .split(',')
            .map(option => option.trim())
            .filter(Boolean),
    }));
}

export function newField(type) {
    return {
        key: nextKey++,
        type,
        label: '',
        hint: '',
        placeholder: '',
        required: true,
        maxLength: type === 'TEXT' ? 30 : type === 'TEXTAREA' ? 200 : '',
        maxFiles: 1,
        options: '',
    };
}
