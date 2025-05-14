import { z } from 'zod';

export const registerSchema = z
    .object({
        fullName: z
            .string()
            .min(6, 'Full name must be at least 6 characters long')
            .max(32, 'Full name must be no more than 32 characters long'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters long')
            .max(32, 'Password must be no more than 32 characters long')
            .regex(
                /[A-Z]/,
                'Password must contain at least one uppercase letter'
            )
            .regex(
                /[^A-Za-z0-9]/,
                'Pasword must contain at least one special character'
            ),
        phoneNumber: z
            .string()
            .min(10, 'Phone number must be at least 10 digits')
            .max(15, 'Phone number must be no more than 15 digits')
            .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
        confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords do not match'
    });
