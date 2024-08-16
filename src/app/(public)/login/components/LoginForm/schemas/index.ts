import { object, string } from 'zod'

export interface CreateClientCredentialsSchema {
    username: string
    password: string
}

export const createClientCredentialsSchema = object({
    username: string().trim().min(1, 'Username is required field'),
    password: string().trim().min(1, "Password can't be blank.")
})
