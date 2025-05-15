import { z } from 'zod';
import { basePropertySchema } from './baseProperty.schema';

export const landSchema = basePropertySchema.extend({
    landUsageDuration: z.string().min(1, 'Land Usage Duration is required'),
    legalStatus: z.string().min(1, 'Legal status is required'),
    roadFrontage: z
        .string()
        .min(1, 'Road frontage is required')
        .regex(/^[0-9]+$/, 'Road frontage must contain only digits'),
    landType: z.string().min(1, 'Land type is required'),
    zoningType: z.string().min(1, 'Zoning type is required'),
    canBuild: z.boolean().default(false)
});
