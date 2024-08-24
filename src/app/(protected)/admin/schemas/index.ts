import { nameSchema, optionalAddressSchema, optionalPhoneSchema } from '@/schemas'
import { object, string, z } from 'zod'

export const createCompanySchema = object({
    name: nameSchema.min(1, 'Company name is a required field.'),
    code: string().min(3, 'Company code is a required field.'),
    telephone: optionalPhoneSchema,
    address: optionalAddressSchema
})

export const updateCompanyDetailsSchema = object({
    name: nameSchema,
    code: string().min(3, 'Company code is a required field.'),
    telephone: optionalPhoneSchema,
    address: optionalAddressSchema
})

export const updateCompanyBrandingColorsSchema = object({
    primaryColor: string().optional(),
    secondaryColor: string().optional()
})

export const updateCompanyBrandingLogoSchema = object({
    logo: z.instanceof(File).optional()
})
