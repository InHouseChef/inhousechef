import { object, string, z } from 'zod'

export const nameSchema = string().trim().max(255, { message: 'Maximum number of characters is 255.' })

export const phoneSchema = z
    .string()
    .trim()
    .max(16, { message: 'Maximum number of characters is 16.' })
    .min(1, { message: 'Telephone is a required field.' })

export const optionalPhoneSchema = string().trim().max(16, { message: 'Maximum number of characters is 16.' })

export const addressSchema = object({
    street: nameSchema.min(1, { message: 'Address 1 is a required field.' }),
    city: nameSchema.min(1, { message: 'City is a required field.' })
})

export const optionalAddressSchema = object({
    Street: nameSchema.optional(),
    City: nameSchema.optional()
})
