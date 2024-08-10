import { object, string } from 'yup'

export const nameSchema = string().trim().max(255, 'Maximum number of characters is 255.')

export const phoneSchema = string()
    .trim()
    .max(16, 'Maximum number of characters is 16.')
    .required('Telephone is a required field.')

export const optionalPhoneSchema = string().trim().max(16, 'Maximum number of characters is 16.')

export const addressSchema = object({
    street: nameSchema.required('Address 1 is a required field.'),
    city: nameSchema.required('City is a required field.')
})
export const optionalAddressSchema = object({
    street: nameSchema,
    city: nameSchema
})
