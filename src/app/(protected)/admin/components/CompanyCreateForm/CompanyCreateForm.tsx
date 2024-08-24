'use client'

import { useCreateCompany } from '@/api/companies'
import { Header, Logo } from '@/components'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createCompanySchema } from '../../schemas'

export const CompanyCreateForm = () => {
    const router = useRouter()
    const { mutate: createCompany } = useCreateCompany()

    const form = useForm<z.infer<typeof createCompanySchema>>({
        resolver: zodResolver(createCompanySchema)
    })

    const { control, handleSubmit } = form

    const onSubmit = (formData: z.infer<typeof createCompanySchema>) => {
        createCompany(
            { path: {}, body: formData },
            {
                onSuccess: data => {
                    router.push(`/admin/companies/${data.code}`)
                }
            }
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                <Header heading='Create Company' />
                <div className='grid grid-cols-12 gap-4'>
                    {/* Left Column */}
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Name <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value || ''}
                                            placeholder='Kristal Ketering'
                                            required
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='code'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Code <span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value || ''} placeholder='kris' required />
                                    </FormControl>
                                    <FormDescription>
                                        The code will be used in the URL (e.g., `/companies/kris`).
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='address.street'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Street</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value || ''} placeholder='Save Kovačevića 1' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='address.city'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value || ''} placeholder='Novi Sad' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='telephone'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Telephone</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value || ''} placeholder='+38160123123' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className='mt-8 flex items-center justify-end'>
                    <Button type='submit'>Create Company</Button>
                </div>
            </form>
        </Form>
    )
}
