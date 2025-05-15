import { z } from 'zod';

export const basePropertySchema = z.object({
    address: z.object({
        ward: z.string().min(1, 'Ward is required'),
        town: z.string().min(1, 'Town is required'),
        province: z.string().min(1, 'Province is required')
    }),
    price: z
        .string()
        .min(1, 'Price is required')
        .regex(/^[0-9.]+$/, 'Price must contain only digits'),
    title: z.string().min(6, 'Title must be at least 6 characters long'),
    typeTransaction: z.string(),
    category: z.string().optional(),
    fullAddress: z
        .string()
        .min(6, 'Full address must be at least 6 characters long'),
    projectName: z.string().optional(),
    description: z
        .string()
        .min(6, 'Description must be at least 6 characters long'),
    squareMeters: z
        .string()
        .min(1, 'Square meters is required')
        .regex(/^[0-9]+$/, 'Square meters must contain only digits'),
    longitude: z
        .string()
        .min(1, 'Longitude is required')
        .regex(/^[0-9.]+$/, 'Longitude must contain only digits'),
    latitude: z
        .string()
        .min(1, 'Latitude is required')
        .regex(/^[0-9.]+$/, 'Latitude must contain only digits'),
    startTime: z.string({ required_error: 'Start time must be selected' }),
    expireTime: z.string({ required_error: 'Expire time must be selected' })
});
