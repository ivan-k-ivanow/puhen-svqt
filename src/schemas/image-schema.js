import * as zod from 'zod';

export const imageSchema = zod.object({
    url: zod.string().url(),
});

