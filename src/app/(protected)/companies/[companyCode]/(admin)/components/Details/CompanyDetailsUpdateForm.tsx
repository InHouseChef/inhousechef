'use client'

import { updateCompanyDetails, useDeleteCompany, useReadCompany } from '@/api/companies'
import { Header, Loader } from '@/components'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'

import { updateCompanyDetailsSchema } from '@/app/(protected)/companies/schemas'
import { Input } from '@/components/ui/input'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface CompanyDetailsUpdateFormProps {
    companyCode: string
}

type CompanyDetailsUpdateFormData = z.infer<typeof updateCompanyDetailsSchema>

export const CompanyDetailsUpdateForm = ({ companyCode }: CompanyDetailsUpdateFormProps) => {
    const { data: company, isLoading } = useReadCompany({ path: { companyCode } })
    const { mutate: deleteCompany } = useDeleteCompany()

    const form = useForm<CompanyDetailsUpdateFormData>({
        resolver: zodResolver(updateCompanyDetailsSchema),
        defaultValues: {
            name: company?.name || '',
            code: company?.code || '',
            address: company?.address || {},
            telephone: company?.telephone || ''
        }
    })

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors }
    } = form

    useEffect(() => {
        if (company) {
            reset({
                name: company?.name || '',
                code: company?.code || '',
                address: company?.address || {},
                telephone: company?.telephone || ''
            });
        }
    }, [company, reset])

    const onSubmit = async (formData: CompanyDetailsUpdateFormData) => {
        const updateResult = await updateCompanyDetails({
            path: { companyCode },
            body: formData
        });

        // Reset the form with the new values
        reset({
            name: updateResult.name,
            code: updateResult.code,
            address: updateResult.address || {},
            telephone: updateResult.telephone || '',
        });
    }

    const handleDeleteCompany = () => deleteCompany({ path: { companyCode } })

    if (isLoading) {
        return <Loader />
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='h-full'>
                <Header heading='Company Information' />
                <div className='grid grid-cols-12'>
                    <div className='col-span-12'>
                        <div className='grid grid-cols-12 gap-3'>
                            <div className='col-span-6'>
                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value || ''} placeholder='Kristal Ketering' required />
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
                                            <FormLabel>Code</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value || ''} placeholder='KK' required />
                                            </FormControl>
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
                                                <Input
                                                    {...field}
                                                    value={field.value || ''}
                                                    placeholder='Save Kovačevića 1'
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
                                    name='address.city'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>City</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value || ''} placeholder='Novi Sad' required />
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
                    </div>
                </div>
                <div className='mt-4'></div>
                <div className='mt-8 flex items-center justify-end'>
                    <div className='flex items-center gap-2'>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button type='button' variant='destructive'>
                                    Delete Company
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to delete {company?.name}?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your company.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteCompany}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Button>Update Company</Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}
