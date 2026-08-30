import * as zod from 'zod';

export const createProductSchema = zod.object({
    name: zod.string().min(1).max(100),
    price: zod.coerce.number().positive(),
    shortDescription: zod.string().max(100).optional(),
    description: zod.string().optional(),
    categoryIds: zod.array(zod.string().uuid()).min(1),
});

export const updateProductSchema = zod.object({
    name: zod.string().min(1).max(100).optional(),
    price: zod.coerce.number().positive().optional(),
    shortDescription: zod.string().max(100).optional(),
    description: zod.string().optional(),
    categoryIds: zod.array(zod.string().uuid()).min(1).optional(),
});