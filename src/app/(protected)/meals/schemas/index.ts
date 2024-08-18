import { nameSchema } from '@/schemas'
import { z, coerce, object, string } from 'zod'

export const createMealSchema = object({
    name: nameSchema.min(1, 'Meal name is a required field.'),
    description: string().min(1, 'Description is a required field.'),
    purchasePrice: coerce.number().min(1, 'Purchase price is a required field.'),
    sellingPrice: coerce.number().min(1, 'Selling price is a required field.'),
    imageUrl: string().optional()
})

export const updateMealDetailsSchema = object({
    name: nameSchema,
    description: string().min(1, 'Description is a required field.'),
    purchasePrice: coerce.number().min(1, 'Purchase price is a required field.'),
    sellingPrice: coerce.number().min(1, 'Selling price is a required field.'),
    imageUrl: string().optional()
})

export const updateMealImageSchema = object({
    image: z.instanceof(File).optional()
})
