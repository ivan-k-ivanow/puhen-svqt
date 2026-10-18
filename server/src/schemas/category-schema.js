import * as zod from 'zod';

export const categorySchema = zod.object({
    name: zod
        .string()
        .trim()
        .min(2, 'Името на категорията трябва да съдържа поне 2 символа')
        .max(50, 'Името на категорията не може да съдържа повече от 50 символа'),
});