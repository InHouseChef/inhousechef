'use client'

import { RolesEnum, useCreateUser } from '@/api/users'
import { Header } from '@/components'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createUserSchema } from '../../schemas'
import { Checkbox } from '@/packages/components'

// Extend the schema to include confirmPassword
const enhancedCreateUserSchema = createUserSchema
    .extend({
        confirmPassword: z
            .string()
            .min(8, 'Password is required.')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                'Password must contain at least one uppercase letter, one lowercase letter, and one number.'
            )
    })
    .refine(data => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Passwords must match'
    })

export const UserCreateForm = ({ params }: { params: { companyCode: string } }) => {
    const { companyCode } = params
    const router = useRouter()
    const { mutate: createUser } = useCreateUser()

    const form = useForm<z.infer<typeof enhancedCreateUserSchema>>({
        resolver: zodResolver(enhancedCreateUserSchema),
        defaultValues: {
            fullName: '',
            username: '',
            password: '',
            confirmPassword: '',
            role: RolesEnum.Employee,
            aLaCardPermission: false // Set default value for checkbox
        }
    })

    const { control, handleSubmit } = form

    const onSubmit = async (formData: z.infer<typeof enhancedCreateUserSchema>) => {
        await createUser(
            { path: { companyCode }, body: formData },
            {
                onSuccess: data => {
                    router.push(`/admin/companies/${companyCode}/users/${data.id}`)
                }
            }
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                <Header heading='Create User' />
                <div className='grid grid-cols-12 gap-4'>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='fullName'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
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
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
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
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type='password' value={field.value || ''} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='confirmPassword'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input {...field} type='password' value={field.value || ''} required />
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
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select role' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={RolesEnum.CompanyManager}>Company Manager</SelectItem>
                                                <SelectItem value={RolesEnum.Employee}>Employee</SelectItem>
                                                <SelectItem value={RolesEnum.RestaurantWorker}>Restaurant Worker</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='aLaCardPermission'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>A La Card Permission</FormLabel>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value} // Bind checked state to form value
                                            onChange={checked => field.onChange(checked)} // Handle change
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className='mt-8 flex items-center justify-end'>
                    <Button type='submit'>Create</Button>
                </div>
            </form>
        </Form>
    )
}
