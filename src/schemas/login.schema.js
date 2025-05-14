import { z } from 'zod';

export const loginSchema = z.object({
    phoneNumber: z
        .string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number too long')
        .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(32, 'Password must be at most 32 characters')
});
