import { nameSchema } from '@/schemas'
import { MealType } from '@/api/meals/contract'
import { z, coerce, object, string } from 'zod'

export const createMealSchema = object({
    name: nameSchema.min(1, 'Meal name is a required field.'),
    description: string().min(1, 'Description is a required field.'),
    purchasePrice: coerce.number().min(1, 'Purchase price is a required field.'),
    sellingPrice: coerce.number().min(1, 'Selling price is a required field.'),
    type: z.enum([MealType.MainCourse, MealType.SideDish]),
    imageUrl: string().optional()
})

export const updateMealDetailsSchema = object({
    name: nameSchema,
    description: string().min(1, 'Description is a required field.'),
    purchasePrice: coerce.number().min(1, 'Purchase price is a required field.'),
    sellingPrice: coerce.number().min(1, 'Selling price is a required field.'),
    type: z.enum([MealType.MainCourse, MealType.SideDish]),
    imageUrl: string().optional()
})

export const updateMealImageSchema = object({
    image: z.instanceof(File).optional()
})
