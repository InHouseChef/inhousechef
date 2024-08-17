import { nameSchema, optionalAddressSchema, optionalPhoneSchema } from '@/schemas'
import { object, string, z } from 'zod'

export const createCompanySchema = object({
    name: nameSchema.min(1, 'Company name is a required field.'),
    code: string().min(1, 'Company code is a required field.'),
    telephone: optionalPhoneSchema,
    address: optionalAddressSchema
})

export const updateCompanySchema = object({
    Company: object({
        Name: nameSchema,
        Code: string().min(1, 'Company code is a required field.'),
        Telephone: optionalPhoneSchema,
        Address: optionalAddressSchema,
        Branding: object({
            // primaryColor: string().optional(),
            // secondaryColor: string().optional(),
            Logo: z.instanceof(FileList).optional()
        })
    })
})
