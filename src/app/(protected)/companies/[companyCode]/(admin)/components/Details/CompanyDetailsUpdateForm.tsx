'use client'

import { updateCompanyDetails, useDeleteCompany, useReadCompany } from '@/api/companies'
import { Header, Loader } from '@/components'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'

import { updateCompanyDetailsSchema } from '@/app/(protected)/companies/schemas'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface CompanyDetailsUpdateFormProps {
    companyCode: string
}

type CompanyDetailsUpdateFormData = z.infer<typeof updateCompanyDetailsSchema>

export const CompanyDetailsUpdateForm = ({ companyCode }: CompanyDetailsUpdateFormProps) => {
    const { data: company, isLoading } = useReadCompany({ path: { companyCode } })
    const { mutate: deleteCompany } = useDeleteCompany()

    const [hasChanges, setHasChanges] = useState(false)

    const form = useForm<CompanyDetailsUpdateFormData>({
        resolver: zodResolver(updateCompanyDetailsSchema),
        defaultValues: {
            name: '',
            code: '',
            address: {
                street: '',
                city: ''
            },
            telephone: ''
        }
    })

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors, isDirty }
    } = form

    useEffect(() => {
        if (company) {
            reset({
                name: company?.name || '',
                code: company?.code || '',
                address: company?.address || { street: '', city: '' },
                telephone: company?.telephone || ''
            })
            setHasChanges(false)
        }
    }, [company, reset])

    useEffect(() => {
        setHasChanges(isDirty)
    }, [isDirty])

    const onSubmit = async (formData: CompanyDetailsUpdateFormData) => {
        const updateResult = await updateCompanyDetails({
            path: { companyCode },
            body: formData
        })

        reset(updateResult)
        setHasChanges(false)
    }

    const handleDeleteCompany = () => deleteCompany({ path: { companyCode } })

    if (isLoading) {
        return <Loader />
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='h-full'>
                <Header heading='Profile' />
                <div className='grid grid-cols-12'>
                    <div className='col-span-12'>
                        <div className='grid grid-cols-12 gap-3'>
                            <div className='col-span-6'>
                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name<span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder='Kristal Ketering' required />
                                            </FormControl>
                                            <FormMessage>{errors.name?.message}</FormMessage>
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
                                            <FormLabel>Code<span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder='KK' required />
                                            </FormControl>
                                            <FormMessage>{errors.code?.message}</FormMessage>
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
                                                <Input {...field} placeholder='Save Kovačevića 1' />
                                            </FormControl>
                                            <FormMessage>{errors.address?.street?.message}</FormMessage>
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
                                                <Input {...field} placeholder='Novi Sad' />
                                            </FormControl>
                                            <FormMessage>{errors.address?.city?.message}</FormMessage>
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
                                                <Input {...field} placeholder='+38160123123' />
                                            </FormControl>
                                            <FormMessage>{errors.telephone?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-8 flex items-center justify-end gap-4'>
                    <Button type="submit" disabled={!hasChanges}>
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    )
}
