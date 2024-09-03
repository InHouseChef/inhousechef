import { ReadUserResponse, RolesEnum } from '@/api/users'
import { updateUserProfile } from '@/api/users/repository/hooks/updateUserProfile'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { nameSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { object, z } from 'zod'
import { useState } from 'react'

const updateUserProfileSchema = object({
    fullName: nameSchema.max(100, 'Ime ne može biti duže od 100 karaktera.'),
    role: z.enum([RolesEnum.CompanyManager, RolesEnum.Employee, RolesEnum.RestaurantWorker]),
    username: z.string().optional()
})

type UpdateUserProfileData = {
    fullName: string
    role: RolesEnum
    username?: string
}

export type UpdateUserFormProps = {
    companyCode: string
    user: ReadUserResponse
    onSubmit: () => void
    onClose: () => void
}

export const UpdateUserForm = ({ companyCode, user, onSubmit, onClose }: UpdateUserFormProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const form = useForm<UpdateUserProfileData>({
        resolver: zodResolver(updateUserProfileSchema),
        defaultValues: {
            fullName: user.fullName,
            role: user.role,
            username: user.username
        }
    })

    const { control, handleSubmit } = form

    const handleOnClose = () => {
        onClose()
    }

    const submit = async (formData: UpdateUserProfileData) => {
        setIsLoading(true)
        setErrorMessage(null)
        try {
            await updateUserProfile({
                path: { companyCode, userId: user.id },
                body: {
                    fullName: formData.fullName,
                    role: formData.role
                }
            })
            onSubmit()
        } catch (error) {
            setErrorMessage('Failed to update user profile. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(submit)} className='space-y-8'>
                <div className='grid grid-cols-12 gap-4 p-4'>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='fullName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ime i prezime</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value || ''} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='username'
                            render={() => (
                                <FormItem>
                                    <FormLabel>Korisničko ime</FormLabel>
                                    <FormControl>
                                        <Input value={user.username} disabled />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='role'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Pozicija</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select role' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={RolesEnum.CompanyManager}>Menadžer</SelectItem>
                                                <SelectItem value={RolesEnum.Employee}>Radnik</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                {errorMessage && (
                    <div className="text-red-500 text-center">
                        {errorMessage}
                    </div>
                )}
                <div className='py-6 flex items-center justify-center gap-4'>
                    <Button variant="outline" onClick={handleOnClose} disabled={isLoading}>Otkaži</Button>
                    <Button variant="default" type="submit" loading={isLoading}>
                        Sačuvaj
                    </Button>
                </div>
            </form>
        </Form>
    )
}
