import { object, string } from 'zod'

export interface CreateClientCredentialsSchema {
    username: string
    password: string
}

export const createClientCredentialsSchema = object({
    username: string().trim().min(1, 'Korisničko ime ne može biti prazno.'),
    password: string().trim().min(1, 'Lozinka ne može biti prazna.')
})
