'use client'

import { RolesEnum, useReadUser } from '@/api/users'
import { updateUserProfile } from '@/api/users/repository/hooks/updateUserProfile'
import { Header, Loader } from '@/components'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { updateUserProfileSchema } from '../../../schemas'

interface UserUpdateProfileFormProps {
    companyCode: string
    userId: string
}
type UserProfileUpdateFormData = z.infer<typeof updateUserProfileSchema>

export const UserUpdateProfileForm = ({ companyCode, userId }: UserUpdateProfileFormProps) => {
    const { data: user, isLoading } = useReadUser({ path: { companyCode, userId } })

    const form = useForm<UserProfileUpdateFormData>({
        resolver: zodResolver(updateUserProfileSchema),
        defaultValues: {
            fullName: '',
            role: RolesEnum.Employee
        }
    })

    const { control, reset, handleSubmit } = form

    useEffect(() => {
        if (user) {
            reset({
                fullName: user.fullName || '',
                role: user.role as RolesEnum.CompanyManager | RolesEnum.Employee | RolesEnum.RestaurantWorker
            })
        }
    }, [user, reset])

    const onSubmit = async (formData: UserProfileUpdateFormData) => {
        const updateResult = await updateUserProfile({
            path: { companyCode, userId },
            body: formData
        })

        reset({
            fullName: updateResult.fullName,
            role: updateResult.role as RolesEnum.CompanyManager | RolesEnum.Employee | RolesEnum.RestaurantWorker
        })
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='h-full'>
                <Header heading='User Profile' />
                <div className='grid grid-cols-12'>
                    <div className='col-span-12'>
                        <div className='grid grid-cols-12 gap-3'>
                            <div className='col-span-6'>
                                <FormField
                                    control={control}
                                    name='fullName'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder='Full Name' required />
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
                                            <FormLabel>Role</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} defaultValue={user?.role}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder='Select Role' />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value={RolesEnum.CompanyManager}>
                                                            Menadžer
                                                        </SelectItem>
                                                        <SelectItem value={RolesEnum.Employee}>Radnik</SelectItem>
                                                        <SelectItem value={RolesEnum.RestaurantWorker}>
                                                            Restoranski radnik
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-8 flex items-center justify-end'>
                    <Button type='submit'>Save</Button>
                </div>
            </form>
        </Form>
    )
}
