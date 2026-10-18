import * as zod from 'zod';

export const loginSchema = zod.object({
  email: zod.string().email('Моля, въведете валиден имейл'),
  password: zod.string().min(6, 'Паролата трябва да съдържа поне 6 символа'),
});

