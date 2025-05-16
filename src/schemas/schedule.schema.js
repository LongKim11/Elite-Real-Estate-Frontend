import { z } from 'zod';

export const scheduleSchema = z.object({
    viewerName: z
        .string()
        .min(3, 'Name must be at least 3 characters long')
        .max(32, 'Name must be no longer 32 characters long'),
    viewerPhone: z
        .string()
        .min(10, 'Phone number must be at least 10 digits')
        .max(15, 'Phone number must be no longer 15 digits')
        .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
    viewerEmail: z.string().email('Invalid email address'),
    viewNotes: z.string().min(1, 'Note is required'),
    scheduledAt: z.string({
        required_error: 'Date and Time must be selected'
    })
});
