import { addressSchema, nameSchema, optionalPhoneSchema } from '@/schemas'
import { object, string } from 'yup'

export const createCompanySchema = object({
    name: nameSchema,
    telephone: optionalPhoneSchema,
    address: addressSchema,
    branding: object({
        primaryColor: string().required('Primary color is a required field.'),
        secondaryColor: string().required('Secondary color is a required field.'),
        logoUrl: string()
    })
})

export const updateCompanySchema = object({
    name: nameSchema,
    telephone: optionalPhoneSchema,
    addresses: addressSchema,
    branding: object({
        primaryColor: string().required('Primary color is a required field.'),
        secondaryColor: string().required('Secondary color is a required field.'),
        logoUrl: string()
    })
})
