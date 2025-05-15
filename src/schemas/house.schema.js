import { z } from 'zod';
import { basePropertySchema } from './baseProperty.schema';

export const houseSchema = basePropertySchema.extend({
    numBedrooms: z
        .string()
        .min(1, 'Bedrooms is required')
        .regex(/^[0-9]+$/, 'Bedrooms must contain only digits'),
    numBathrooms: z
        .string()
        .min(1, 'Bathrooms is required')
        .regex(/^[0-9]+$/, 'Bathrooms must contain only digits'),
    floor: z.string().min(1, 'Floor is required'),
    landArea: z
        .string()
        .min(1, 'Land area is required')
        .regex(/^[0-9]+$/, 'Land area must contain only digits'),
    houseType: z.string().min(1, 'House type is required'),
    hasGarden: z.boolean().default(false),
    hasGarage: z.boolean().default(false)
});
