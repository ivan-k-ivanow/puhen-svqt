import * as zod from 'zod';

export const ORDER_STATUSES = [
    'NEW',
    'CONFIRMED',
    'IN_PROGRESS',
    'READY',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
];

export const ORDER_CHANNELS = ['INSTAGRAM', 'FACEBOOK', 'TIKTOK', 'WEBSITE', 'PHONE', 'OTHER'];
export const COURIERS = ['ECONT', 'SPEEDY', 'PICKUP'];
export const PAYMENT_METHODS = ['CASH_ON_DELIVERY', 'BANK_TRANSFER', 'CASH'];

// Празен текст от формата се записва като null.
const optionalText = (max) =>
    zod
        .string()
        .trim()
        .max(max)
        .optional()
        .nullable()
        .transform(value => (value ? value : null));

// Персонализацията от сайта се връща непроменена при редакция на поръчката.
const personalizationSchema = zod
    .array(
        zod.object({
            fieldId: zod.string().optional().nullable(),
            label: zod.string(),
            type: zod.string(),
            value: zod.any(),
        })
    )
    .optional()
    .nullable();

const orderItemSchema = zod.object({
    productId: zod.string().uuid().optional().nullable(),
    name: zod.string().trim().min(1, 'Изберете продукт').max(150),
    quantity: zod.coerce.number().int().min(1, 'Броят трябва да е поне 1'),
    unitPrice: zod.coerce.number().min(0, 'Цената не може да е отрицателна'),
    personalization: personalizationSchema,
});

const orderFields = {
    customerName: zod
        .string()
        .trim()
        .min(2, 'Името трябва да съдържа поне 2 символа')
        .max(100),
    customerPhone: zod
        .string()
        .trim()
        .min(6, 'Невалиден телефон')
        .max(30),
    channel: zod.enum(ORDER_CHANNELS),
    courier: zod.enum(COURIERS),
    deliveryAddress: optionalText(300),
    paymentMethod: zod.enum(PAYMENT_METHODS),
    deadline: zod
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Невалидна дата')
        .optional()
        .nullable()
        .or(zod.literal(''))
        .transform(value => (value ? value : null)),
    notes: optionalText(2000),
    items: zod.array(orderItemSchema).min(1, 'Добавете поне един продукт'),
};

export const createOrderSchema = zod.object(orderFields);

// При редакция се променят и полетата, които ги няма при създаване.
export const updateOrderSchema = zod.object({
    ...orderFields,
    status: zod.enum(ORDER_STATUSES),
    trackingNumber: optionalText(50),
    isPaid: zod.boolean(),
});

export const updateOrderStatusSchema = zod.object({
    status: zod.enum(ORDER_STATUSES),
    trackingNumber: optionalText(50),
});

export const updateOrderPaidSchema = zod.object({
    isPaid: zod.boolean(),
});

// Поръчка от формата на сайта.
export const CONTACT_METHODS = ['CALL', 'VIBER', 'MESSENGER'];

export const websiteOrderSchema = zod.object({
    productId: zod.string().uuid('Невалиден продукт'),
    quantity: zod.coerce.number().int().min(1).max(500).default(1),
    personalization: zod.record(zod.string(), zod.string().max(2000)).default({}),
    customerName: zod
        .string()
        .trim()
        .min(2, 'Въведете име и фамилия')
        .max(100),
    customerPhone: zod
        .string()
        .trim()
        .regex(/^[+\d][\d\s()-]{5,24}$/, 'Въведете валиден телефон'),
    customerEmail: zod
        .string()
        .trim()
        .max(150)
        .optional()
        .nullable()
        .transform(value => (value ? value : null))
        .refine(value => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), 'Въведете валиден имейл'),
    contactMethod: zod.enum(CONTACT_METHODS),
    city: zod.string().trim().min(2, 'Въведете град').max(80),
    office: zod.string().trim().min(2, 'Въведете офис на Еконт').max(150),
    deadline: zod
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Невалидна дата')
        .optional()
        .nullable()
        .or(zod.literal(''))
        .transform(value => (value ? value : null)),
    notes: optionalText(1000),
    substitutionConsent: zod.boolean().default(false),
    privacyAccepted: zod.literal(true, { message: 'Трябва да приемете политиката за поверителност' }),
    // Скрито поле срещу ботове – хората не го виждат и не го попълват.
    website: zod.string().max(0, 'Невалидни данни.').optional().or(zod.literal('')),
    attribution: zod
        .record(zod.string(), zod.string().max(500))
        .optional()
        .nullable(),
});
