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
import { zodResolver } from '@hookform/resolvers/zod'

import { updateCompanySchema } from '@/app/(protected)/companies/schemas'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FileUploader } from '@/components/FileUploader'
import { FileInput, FileUploaderContent, FileUploaderItem } from '@/components/FileUploader/FileUploader'
import { Paperclip } from 'lucide-react'

interface CompanyUpdateFormProps {
    companyCode: string
}

type CompanyUpdateFormFormData = z.infer<typeof updateCompanySchema>

const FileSvgDraw = () => {
    return (
      <>
        <svg
          className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Click to upload</span>
          &nbsp; or drag and drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          PNG, JPG or JPEG
        </p>
      </>
    );
  };

export const CompanyUpdateForm = ({ companyCode }: CompanyUpdateFormProps) => {
    const [files, setFiles] = useState<File[] | null>(null);
    const { data: company, isLoading } = useReadCompany({ path: { companyCode } })
    const { mutate: deleteCompany } = useDeleteCompany()

    const form = useForm<CompanyUpdateFormFormData>({
        resolver: zodResolver(updateCompanySchema),
        defaultValues: {
            company: {
                name: company?.name || '',
                code: company?.code || '',
                address: company?.address || {},
                telephone: company?.telephone || ''
            }
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
                company: {
                    name: company.name,
                    code: company.code,
                    address: company.address || {},
                    telephone: company.telephone || ''
                }
            });
        }
    }, [company, reset])

    if (isLoading) {
        return <Loader />
    }

    const onSubmit = (formData: CompanyUpdateFormFormData) => {
        const body = new FormData();

        body.append('company.name', formData.company.name)
        body.append('company.code', formData.company.code)
        if (formData.company.telephone)
            body.append('company.telephone', formData.company.telephone)
        if (formData.company.address.street)
            body.append('company.address.street', formData.company.address.street)
        if (formData.company.address.city)
            body.append('company.address.city', formData.company.address.city)
        if (files && files.length > 0)
            body.append('company.branding.logo', files[0])

        updateCompany({
            path: { companyCode },
            // @ts-ignore
            body: body
        });
    }

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
                                    name="company.name"
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
                                    name='company.code'
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
                                                        value={field.value || ''}
                                                        placeholder='Save Kovačevića 1'
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
                                                    <Input {...field} value={field.value || ''} placeholder='Novi Sad' required />
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
                                                <Input {...field} value={field.value || ''} placeholder='+38160123123' />
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
                            {/* TODO: insert Company logo here */}
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
                            control={form.control}
                            name='company.branding.logo'
                            render={({ field: { value, onChange, ...fieldProps } }) => (
                                <FormItem>
                                    <FormLabel>Logo</FormLabel>
                                    <FormControl>
                                        <FileUploader
                                            {...fieldProps}
                                            value={files}
                                            onValueChange={setFiles}
                                            className="relative bg-background rounded-lg p-2"
                                            >
                                            <FileInput className="outline-dashed outline-1 outline-white">
                                                <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                                                <FileSvgDraw />
                                                </div>
                                            </FileInput>
                                            <FileUploaderContent>
                                                {files &&
                                                files.length > 0 &&
                                                files.map((file, i) => (
                                                    <FileUploaderItem key={i} index={i}>
                                                    <Paperclip className="h-4 w-4 stroke-current" />
                                                    <span>{file.name}</span>
                                                    </FileUploaderItem>
                                                ))}
                                            </FileUploaderContent>
                                            </FileUploader>
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
