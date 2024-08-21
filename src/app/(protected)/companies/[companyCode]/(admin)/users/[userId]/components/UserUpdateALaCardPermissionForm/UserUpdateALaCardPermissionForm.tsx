'use client'

import { useReadUser } from '@/api/users'
import { Header, Loader } from '@/components'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { updateUserALaCardPermissionSchema } from '../../../schemas'
import { updateUserALaCardPermission } from '@/api/users/repository/hooks/updateUserALaCardPermission'
import { Checkbox } from '@/packages/components'

interface UserUpdateALaCardPermissionFormProps {
    companyCode: string
    userId: string
}
type UserALaCardPermissionUpdateFormData = z.infer<typeof updateUserALaCardPermissionSchema>

export const UserUpdateALaCardPermissionForm = ({ companyCode, userId }: UserUpdateALaCardPermissionFormProps) => {
    const { data: user, isLoading } = useReadUser({ path: { companyCode, userId } })

    const form = useForm<UserALaCardPermissionUpdateFormData>({
        resolver: zodResolver(updateUserALaCardPermissionSchema),
        defaultValues: {
            aLaCard: false,
        }
    })

    const { control, reset, handleSubmit } = form

    useEffect(() => {
        if (user) {
            reset({
                aLaCard: user.aLaCardPermission || false,
            })
        }
    }, [user, reset])

    const onSubmit = async (formData: UserALaCardPermissionUpdateFormData) => {
        const updateResult = await updateUserALaCardPermission({
            path: { companyCode, userId },
            body: formData,
        })

        reset({
            aLaCard: updateResult.aLaCardPermission,
        })
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='h-full'>
                <Header heading='A La Card Permission' />
                <div className='grid grid-cols-12'>
                    <div className='col-span-12'>
                        <FormField
                            control={control}
                            name="aLaCard"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>A La Card Permission</FormLabel>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className='mt-8 flex items-center justify-end'>
                    <Button type='submit'>Save</Button>
                </div>
            </form>
        </Form>
    )
}
