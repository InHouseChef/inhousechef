import { RolesEnum } from '@/apis/users'
import { nameSchema } from '@/schemas'
import { z, object, string, boolean } from 'zod'

export const createUserSchema = object({
    fullName: nameSchema.max(100, 'Name cannot be longer than 100 characters.'),
    username: string().min(1, 'Username is required.'),
    password: string()
        .min(8, 'Password is required.')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
        ),
    aLaCardPermission: boolean(),
    role: z.enum([RolesEnum.CompanyManager, RolesEnum.Employee, RolesEnum.RestaurantWorker])
})

export const updateUserProfileSchema = object({
    fullName: nameSchema.max(100, 'Name cannot be longer than 100 characters.'),
    role: z.enum([RolesEnum.CompanyManager, RolesEnum.Employee, RolesEnum.RestaurantWorker])
})

export const updateUserALaCardPermissionSchema = object({
    aLaCard: boolean()
})
