import { ObjectSchema, object, string } from 'yup'

export interface CreateClientCredentialsSchema {
    username: string
    password: string
}

export const createClientCredentialsSchema: ObjectSchema<CreateClientCredentialsSchema> = object({
    username: string().trim().required('Username is required field'),
    password: string().trim().required("Password can't be blank.")
})
