'use client'

import { useCreateCompany } from '@/api/companies'
import { Header, Logo, RequireCompanyAuthorization } from '@/components'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
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
                // onSuccess: data => {
                //     router.push(`/companies/${data.id}`)
                // }
            }
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                <RequireCompanyAuthorization role={'Admin'}>
                    <Header heading='Create Company' />
                </RequireCompanyAuthorization>
                <div className='grid grid-cols-12 gap-6'>
                    <div className='col-span-6 space-y-4'>
                        <div className='w-1/2 space-y-4'>
                            <FormField
                                control={control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Kristal Ketering' required />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name='code'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Code</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='kris' required />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name='address.street'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Street</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Save Kovačevića 1' required />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name='address.city'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='Novi Sad' required />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name='telephone'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telephone</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder='+38160123123' required />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <div className='col-span-6 flex items-center justify-center'>
                        <div className='flex h-48 w-48 items-center justify-center'>
                            <Logo width={150} height={150} />
                        </div>
                    </div>
                </div>
                <div className='mt-8 flex items-center justify-end'>
                    <Button>Create Company</Button>
                </div>
            </form>
        </Form>
    )
}
