import * as zod from 'zod';

export const createProductSchema = zod.object({
    name: zod.string().min(1).max(100),
    price: zod.coerce.number(),
    shortDescription: zod.string().max(100).optional(),
    description: zod.string().optional(),
    categoryIds: zod.array(zod.string().uuid()).min(1),
});

export const updateProductSchema = zod.object({
    name: zod.string().min(1).max(100).optional(),
    price: zod.coerce.number().optional(),
    shortDescription: zod.string().max(100).optional(),
    description: zod.string().optional(),
    categoryIds: zod.array(zod.string().uuid()).min(1).optional(),
});
// Полета за персонализация. Пристигат като JSON текст във FormData.
export const PRODUCT_FIELD_TYPES = ['PHOTO', 'TEXT', 'TEXTAREA', 'DATE', 'CHOICE'];

const optionalFieldText = (max) =>
    zod
        .string()
        .trim()
        .max(max)
        .optional()
        .nullable()
        .transform(value => (value ? value : null));

const productFieldSchema = zod
    .object({
        type: zod.enum(PRODUCT_FIELD_TYPES),
        label: zod.string().trim().min(1, 'Всяко поле трябва да има заглавие').max(80),
        hint: optionalFieldText(300),
        placeholder: optionalFieldText(100),
        required: zod.boolean().default(true),
        maxLength: zod.coerce.number().int().min(1).max(2000).optional().nullable(),
        maxFiles: zod.coerce.number().int().min(1).max(10).optional().nullable(),
        options: zod.array(zod.string().trim().min(1).max(60)).max(20).default([]),
    })
    .transform(field => ({
        ...field,
        // Пазим само настройките, които имат смисъл за типа.
        maxLength: ['TEXT', 'TEXTAREA'].includes(field.type) ? field.maxLength ?? null : null,
        maxFiles: field.type === 'PHOTO' ? field.maxFiles ?? 1 : null,
        placeholder: ['TEXT', 'TEXTAREA'].includes(field.type) ? field.placeholder : null,
        options: field.type === 'CHOICE' ? field.options : [],
    }))
    .refine(field => field.type !== 'CHOICE' || field.options.length >= 2, {
        message: 'Полето „Избор“ трябва да има поне 2 варианта',
    });

export const productFieldsSchema = zod.array(productFieldSchema).max(10);

export function parseProductFields(raw) {
    if (raw === undefined) {
        return undefined;
    }

    let value;

    try {
        value = typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch {
        throw new zod.ZodError([{ code: 'custom', path: ['fields'], message: 'Невалидни полета за персонализация' }]);
    }

    return productFieldsSchema.parse(value);
}
