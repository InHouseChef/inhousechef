'use client'

import { updateCompany, useDeleteCompany, useReadCompany } from '@/api/companies'
import { Header, Loader, Logo } from '@/components'
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
import { ColorInput } from '@/packages/components/Form/components'
import { zodResolver } from '@hookform/resolvers/zod'

import { Input } from '@/components/ui/input'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { updateCompanySchema } from '../../../schemas'

interface CompanyUpdateFormProps {
    companyCode: string
}

type CompanyUpdateFormFormData = z.infer<typeof updateCompanySchema>

export const CompanyUpdateForm = ({ companyCode }: CompanyUpdateFormProps) => {
    const { data: company, isLoading } = useReadCompany({ path: { companyCode } })
    const { mutate: deleteCompany } = useDeleteCompany()

    const form = useForm<CompanyUpdateFormFormData>({
        resolver: zodResolver(updateCompanySchema)
    })

    const { control, reset, handleSubmit } = form

    useEffect(() => {
        if (!company) return
        const copyCompany = structuredClone(company)
        reset({ company: copyCompany })
    }, [company])

    if (isLoading) {
        return <Loader />
    }

    const onSubmit = (formData: CompanyUpdateFormFormData) => updateCompany({ path: { companyCode }, body: formData })

    const handleDeleteCompany = () => deleteCompany({ path: { companyCode } })

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='h-full'>
                <Header heading='Company Information' />
                <div className='grid grid-cols-12'>
                    <div className='col-span-6'>
                        <div className='grid grid-cols-12 gap-3'>
                            <div className='col-span-6'>
                                <FormField
                                    control={control}
                                    name='company.name'
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
                            </div>
                            <div className='col-span-6'>
                                <FormField
                                    control={control}
                                    name='company.code'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Code</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder='KK' required />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-12'>
                                <div className='flex items-center gap-4'>
                                    <FormField
                                        control={control}
                                        name='company.address.street'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Street</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder='Save 
                                                Kovačevića 1'
                                                        required
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={control}
                                        name='company.address.city'
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
                                </div>
                            </div>
                            <div className='col-span-6'>
                                <FormField
                                    control={control}
                                    name='company.telephone'
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
                    </div>
                    <div className='col-span-6'>
                        <div className='flex h-64 items-center justify-center rounded-lg'>
                            {/* TODO: insert company logo here */}
                            {/* <Image
                                src={<Logo />}
                                alt='Company Logo'
                                className='h-32'
                                width={500}
                                height={500}
                            /> */}
                            <Logo width={150} height={150} />
                        </div>
                    </div>
                </div>
                <h2 className='mt-16 text-center text-3xl font-semibold'>Branding</h2>
                <div className='mt-8 flex items-center justify-between'>
                    <div className='flex items-center gap-8'>
                        <FormField
                            control={control}
                            name='company.branding.primaryColor'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Primary Color</FormLabel>
                                    <FormControl>
                                        <ColorInput {...field} required />
                                        {/* <Input {...field} type='color' placeholder='#123123' required /> */}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name='company.branding.secondaryColor'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Secondary Color</FormLabel>
                                    <FormControl>
                                        <ColorInput {...field} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name='company.branding.files'
                            render={({ field: { value, onChange, ...fieldProps } }) => (
                                <FormItem>
                                    <FormLabel>Logo</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...fieldProps}
                                            type='file'
                                            accept='image/*'
                                            required
                                            onChange={event => onChange(event.target.files && event.target.files[0])}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
