export const MAX_PHOTO_SIZE = 10 * 1024 * 1024;

// Проверка преди преминаване към поръчката.
export function validatePersonalization(fields, values, files) {
    const errors = {};

    for (const field of fields) {
        if (field.type === 'PHOTO') {
            const list = files[field.id] ?? [];

            if (field.required && list.length === 0) {
                errors[field.id] = 'Качете поне една снимка.';
            } else if (list.some(file => file.size > MAX_PHOTO_SIZE)) {
                errors[field.id] = 'Някоя от снимките е над 10 MB.';
            } else if (list.some(file => !file.type.startsWith('image/'))) {
                errors[field.id] = 'Може да качвате само снимки.';
            }

            continue;
        }

        const value = (values[field.id] ?? '').trim();

        if (field.required && !value) {
            errors[field.id] = field.type === 'CHOICE' ? 'Изберете вариант.' : 'Това поле е задължително.';
        }
    }

    return errors;
}
