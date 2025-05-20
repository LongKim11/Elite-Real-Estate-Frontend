import { z } from 'zod';
import { basePropertySchema } from './baseProperty.schema';

export const apartmentSchema = basePropertySchema.extend({
    numBedrooms: z
        .string()
        .min(1, 'Bedrooms is required')
        .regex(/^[0-9]+$/, 'Bedrooms must contain only digits'),
    numBathrooms: z
        .string()
        .min(1, 'Bathrooms is required')
        .regex(/^[0-9]+$/, 'Bathrooms must contain only digits'),
    floor: z.string().min(1, 'Floor is required'),
    buildingName: z
        .string()
        .min(3, 'Building name must be at least 3 characters long'),
    hasBalcony: z.boolean().default(false),
    maintenanceFee: z
        .string()
        .min(1, 'Maintenance fee is required')
        .regex(/^[0-9]+$/, 'Maintenance fee must contain only digits'),
    parkingAvailability: z.boolean().default(false)
});
