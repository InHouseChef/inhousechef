'use client'

import { updateMealDetails, useDeleteMeal, useReadMeal, updateMealImage } from '@/api/meals'
import { Header, Loader } from '@/components'
import { FileUploader } from '@/components/FileUploader'
import { FileUploaderContent, FileInput, FileUploaderItem, FileSvgDraw } from '@/components/FileUploader/FileUploader'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Textarea } from '@/components/ui/textarea'
import { Paperclip } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { updateMealDetailsSchema } from '../../../schemas'
import { Input } from '@/components/ui/input'
import { AlertDialogFooter, 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogTrigger, } from '@/components/ui/alert-dialog'

interface MealUpdateFormProps {
    mealId: string
}

export const MealUpdateForm = ({ mealId }: MealUpdateFormProps) => {
    const { data: meal, isLoading } = useReadMeal({ path: { mealId } })
    const { mutate: deleteMeal } = useDeleteMeal()
    const router = useRouter()

    const [files, setFiles] = useState<File[] | null>(null)
    const [imageURL, setImageURL] = useState<string | null | undefined>(null)
    const [previewImageURL, setPreviewImageURL] = useState<string | null>(null) // State for preview image
    const [isModalOpen, setIsModalOpen] = useState(false) // State to control the modal

    const form = useForm<z.infer<typeof updateMealDetailsSchema>>({
        resolver: zodResolver(updateMealDetailsSchema),
        defaultValues: {
            name: meal?.name || '',
            purchasePrice: meal?.purchasePrice || 0,
            sellingPrice: meal?.sellingPrice || 0,
            description: meal?.description || ''
        }
    })

    const { control, reset, handleSubmit, formState: { errors } } = form

    useEffect(() => {
        if (meal) {
            reset({
                name: meal?.name || '',
                purchasePrice: meal?.purchasePrice || 0,
                sellingPrice: meal?.sellingPrice || 0,
                description: meal?.description || ''
            })
            setImageURL(meal?.imageUrl || '')
        }
    }, [meal, reset])

    if (isLoading) {
        return <Loader />
    }

    const handleFileChange = (newFiles: File[] | null) => {
        setFiles(newFiles)
        if (newFiles && newFiles.length > 0) {
            const file = newFiles[0]
            setPreviewImageURL(URL.createObjectURL(file)) // Set the preview image URL
        }

        if (!newFiles || newFiles.length === 0) {
            setPreviewImageURL(null) // Clear the preview image URL
        }
    }

    const uploadImage = async () => {
        if (files && files.length > 0) {
            const formData = new FormData()
            formData.append('image', files[0])
            const uploadedImageUrl = await updateMealImage({ path: { mealId }, body: formData })
            setImageURL(uploadedImageUrl.imageUrl) // Update the main image URL
            setFiles(null) // Clear files after upload
            setPreviewImageURL(null) // Clear the preview after upload
            setIsModalOpen(false) // Close the modal
            return uploadedImageUrl
        }
        return null
    }

    const onSubmit = async (formData: z.infer<typeof updateMealDetailsSchema>) => {
        const updateResult = await updateMealDetails({ path: { mealId }, body: formData })
        reset(updateResult)
    }

    const handleDeleteMeal = () => deleteMeal({ path: { mealId } }, { onSuccess: () => router.push('/meals') })

    return (
        <Form {...form}>
            <Header heading={meal?.name}/>
            <form onSubmit={handleSubmit(onSubmit)} className='flex gap-8'>
                {/* Left Section: Image Upload */}
                <div className='w-1/3 flex flex-col items-center bg-gray-50 p-6 rounded-lg shadow-md'>
                    <div className='w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center'>
                        {imageURL ? (
                            <img src={imageURL} alt='Meal image' className='object-cover w-full h-full rounded-lg' />
                        ) : (
                            <span className='text-gray-500'>No image available</span>
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
                                    <div className='mt-4 w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center'>
                                        <img src={previewImageURL} alt='Preview image' className='object-cover w-full h-full rounded-lg' />
                                    </div>
                                )}

                                <FormField
                                    control={control}
                                    name='imageUrl'
                                    render={({ field: { value, onChange, ...fieldProps } }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUploader
                                                    {...fieldProps}
                                                    value={files}
                                                    onValueChange={handleFileChange}
                                                    className="relative bg-background rounded-lg p-2"
                                                >
                                                    <FileInput className="outline-dashed outline-1 outline-white">
                                                        <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full">
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

                                <div className='mt-6 flex justify-end gap-4'>
                                    <AlertDialogCancel asChild>
                                        <Button variant='secondary' onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                    </AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                        <Button onClick={uploadImage}>Confirm Upload</Button>
                                    </AlertDialogAction>
                                </div>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                {/* Right Section: Form Fields */}
                <div className='w-2/3 bg-white p-6 rounded-lg shadow-md'>
                    <div className='flex flex-col gap-4'>
                        <FormField
                            control={control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='Cezar salata' required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name='purchasePrice'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Purchase Price</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='30 rsd' required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name='sellingPrice'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Selling Price</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='50 rsd' required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='Describe the meal, ingredients, and flavors.'
                                            className='resize-none'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='flex justify-end gap-4 mt-6'>
                            <Button type='submit'>
                                Save Meal
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button type='button' variant='destructive'>
                                        Delete Meal
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogTitle>Are you sure you want to delete {meal?.name}?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your meal.
                                    </AlertDialogDescription>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDeleteMeal}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    )
}
