'use client'

import { readCompany, updateCompanyBrandingLogo } from '@/api/companies'
import { updateCompanyBrandingLogoSchema } from '@/app/(protected)/admin/schemas'
import { Header } from '@/components'
import { FileUploader } from '@/components/FileUploader'
import { FileInput, FileSvgDraw, FileUploaderContent, FileUploaderItem } from '@/components/FileUploader/FileUploader'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader, Paperclip } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface CompanyUpdateFormProps {
    companyCode: string
}

type CompanyBrandingLogoUpdateFormData = z.infer<typeof updateCompanyBrandingLogoSchema>

export const CompanyBrandingLogoUpdateForm = ({ companyCode }: CompanyUpdateFormProps) => {
    const [files, setFiles] = useState<File[] | null>(null)
    const [imageURL, setImageURL] = useState<string | null | undefined>(null) // State to hold image URL
    const [previewImageURL, setPreviewImageURL] = useState<string | null>(null) // State for preview image
    const [isModalOpen, setIsModalOpen] = useState(false) // State to control the modal
    const [isLoading, setIsLoading] = useState(true)
    const [company, setCompany] = useState<any>(null) // State to store company data

    const form = useForm<CompanyBrandingLogoUpdateFormData>({
        resolver: zodResolver(updateCompanyBrandingLogoSchema)
    })

    const { handleSubmit } = form

    useEffect(() => {
        const fetchCompanyData = async () => {
            setIsLoading(true)
            try {
                const result = await readCompany({ path: { companyCode }, query: {} })
                setCompany(result)
                setImageURL(result.branding?.logoUrl || '')
            } catch (error) {
                console.error('Failed to fetch company data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCompanyData()
    }, [companyCode])

    if (isLoading) {
        return <Loader />
    }

    const handleFileChange = (newFiles: File[] | null) => {
        setFiles(newFiles)
        if (newFiles && newFiles.length > 0) {
            const file = newFiles[0]
            setPreviewImageURL(URL.createObjectURL(file)) // Set the preview image URL
        } else {
            setPreviewImageURL(null) // Clear the preview image URL
        }
    }

    const uploadImage = async () => {
        if (files && files.length > 0) {
            const formData = new FormData()
            formData.append('logo', files[0])
            try {
                // @ts-ignore
                const updateResult = await updateCompanyBrandingLogo({ path: { companyCode }, body: formData })
                setImageURL(updateResult.branding?.logoUrl) // Update the main image URL
                setFiles(null) // Clear files after upload
                setPreviewImageURL(null) // Clear the preview after upload
                setIsModalOpen(false) // Close the modal
                return updateResult
            } catch (error) {
                console.error('Failed to update company logo:', error)
            }
        }
        return null
    }

    const onSubmit = async () => {
        await uploadImage()
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='h-full'>
                <Header heading='Logo' />
                <div className='flex w-1/3 flex-col items-center rounded-lg bg-gray-50 p-6 shadow-md'>
                    <div className='flex h-64 w-full items-center justify-center rounded-lg bg-gray-200'>
                        {imageURL ? (
                            <img src={imageURL} alt='Company logo' className='h-full w-full rounded-lg object-cover' />
                        ) : (
                            <span className='text-center text-gray-500'>No image</span>
                        )}
                    </div>
                    <div className='mt-4'>
                        <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <AlertDialogTrigger asChild>
                                <Button variant='outline'>Replace Image</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className='p-6'>
                                <AlertDialogTitle>Upload New Image</AlertDialogTitle>
                                <AlertDialogDescription className='mb-4'>
                                    Select an image to upload. Preview it before confirming the upload.
                                </AlertDialogDescription>

                                {previewImageURL && (
                                    <div className='mt-4 flex h-64 w-full items-center justify-center rounded-lg bg-gray-100'>
                                        <img
                                            src={previewImageURL}
                                            alt='Preview image'
                                            className='h-full w-full rounded-lg object-cover'
                                        />
                                    </div>
                                )}

                                <FormField
                                    control={form.control}
                                    name='logo'
                                    render={({ field: { value, onChange, ...fieldProps } }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUploader
                                                    {...fieldProps}
                                                    value={files}
                                                    onValueChange={handleFileChange}
                                                    className='relative rounded-lg bg-background p-2'>
                                                    <FileInput className='outline-dashed outline-1 outline-white'>
                                                        <div className='flex w-full flex-col items-center justify-center pb-4 pt-3'>
                                                            <FileSvgDraw />
                                                        </div>
                                                    </FileInput>
                                                    <FileUploaderContent>
                                                        {files &&
                                                            files.length > 0 &&
                                                            files.map((file, i) => (
                                                                <FileUploaderItem key={i} index={i}>
                                                                    <Paperclip className='h-4 w-4 stroke-current' />
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

                                <div className='mt-6 flex justify-end gap-4'>
                                    <AlertDialogCancel asChild>
                                        <Button variant='secondary' onClick={() => setIsModalOpen(false)}>
                                            Cancel
                                        </Button>
                                    </AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button onClick={uploadImage}>Confirm Upload</Button>
                                    </AlertDialogAction>
                                </div>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            </form>
        </Form>
    )
}
