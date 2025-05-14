import { z } from 'zod';

export const observerSchema = z.object({
    email: z.string().email('Invalid email address')
});
