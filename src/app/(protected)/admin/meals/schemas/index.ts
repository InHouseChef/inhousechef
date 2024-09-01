import { MealTypeEnum } from '@/apis/meals/contract'
import { nameSchema } from '@/schemas'
import { coerce, object, string, z } from 'zod'

export const createMealSchema = object({
    name: nameSchema.min(1, 'Meal name is a required field.'),
    description: string().min(1, 'Description is a required field.'),
    purchasePrice: coerce.number().min(1, 'Purchase price is a required field.'),
    sellingPrice: coerce.number().min(1, 'Selling price is a required field.'),
    type: z.enum([MealTypeEnum.MainCourse, MealTypeEnum.SideDish]),
    imageUrl: string().optional()
})

export const updateMealDetailsSchema = object({
    name: nameSchema,
    description: string().min(1, 'Description is a required field.'),
    purchasePrice: coerce.number().min(1, 'Purchase price is a required field.'),
    sellingPrice: coerce.number().min(1, 'Selling price is a required field.'),
    type: z.enum([MealTypeEnum.MainCourse, MealTypeEnum.SideDish]),
    imageUrl: string().optional()
})

export const updateMealImageSchema = object({
    image: z.instanceof(File).optional()
})
