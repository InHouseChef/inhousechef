'use client'

import { MealTypeEnum, ReadMealResponse, updateMealDetails, updateMealImage } from '@/api/meals'
import { deleteMeal } from '@/api/meals/repository/hooks/deleteMeal'
import { readMeal } from '@/api/meals/repository/hooks/readMeal'
import { Header, Loader } from '@/components'
import { FileUploader } from '@/components/FileUploader'
import { FileInput, FileSvgDraw, FileUploaderContent, FileUploaderItem } from '@/components/FileUploader/FileUploader'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Paperclip } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { updateMealDetailsSchema } from '../../../schemas'

interface MealUpdateFormProps {
    mealId: string
}

export const MealUpdateForm = ({ mealId }: MealUpdateFormProps) => {
    const [meal, setMeal] = useState<ReadMealResponse | null>(null)
    const [isLoading, setIsLoading] = useState(true)
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
            description: meal?.description || '',
            type: meal?.type || MealTypeEnum.MainCourse // Set default type
        }
    })

    const {
        control,
        reset,
        handleSubmit,
        formState: { errors }
    } = form

    useEffect(() => {
        setIsLoading(true)
        readMeal({ path: { mealId }, query: {} }).then(res => {
            setMeal(res)
            setIsLoading(false)
        })
    }, [])

    useEffect(() => {
        if (meal) {
            reset({
                name: meal?.name || '',
                purchasePrice: meal?.purchasePrice || 0,
                sellingPrice: meal?.sellingPrice || 0,
                description: meal?.description || '',
                type: meal?.type || MealTypeEnum.MainCourse // Set default type
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
            // @ts-ignore
            const updateResult = await updateMealImage({ path: { mealId }, body: formData })
            setMeal(updateResult)
            setImageURL(updateResult.imageUrl) // Update the main image URL
            setFiles(null) // Clear files after upload
            setPreviewImageURL(null) // Clear the preview after upload
            setIsModalOpen(false) // Close the modal
            return updateResult
        }
        return null
    }

    const onSubmit = (formData: z.infer<typeof updateMealDetailsSchema>) => {
        updateMealDetails({ path: { mealId }, body: formData })
    }

    const handleDeleteMeal = () => {
        deleteMeal({ path: { mealId } }).then(() => router.push('/admin/meals'))
    }

    return (
        <Form {...form}>
            <Header heading={meal?.name} />
            <form onSubmit={handleSubmit(onSubmit)} className='flex gap-8'>
                {/* Left Section: Image Upload */}
                <div className='flex w-1/3 flex-col items-center rounded-lg bg-gray-50 p-6 shadow-md'>
                    <div className='flex h-64 w-full items-center justify-center rounded-lg bg-gray-200'>
                        {imageURL ? (
                            <img src={imageURL} alt='Meal image' className='h-full w-full rounded-lg object-cover' />
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
                                    control={control}
                                    name='imageUrl'
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

                {/* Right Section: Form Fields */}
                <div className='w-2/3 rounded-lg bg-white p-6 shadow-md'>
                    <div className='flex flex-col gap-4'>
                        <FormField
                            control={control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Name<span className='text-red-500'>*</span>
                                    </FormLabel>
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
                                    <FormLabel>
                                        Purchase Price<span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='30 rsd' required type='number' />
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
                                    <FormLabel>
                                        Selling Price<span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='50 rsd' required type='number' />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={control}
                            name='type'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Type<span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={meal?.type} required>
                                            <SelectTrigger>
                                                <SelectValue placeholder='Select meal type' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='MainCourse'>Main Course</SelectItem>
                                                <SelectItem value='SideDish'>Side Dish</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                                    <FormLabel>
                                        Description<span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='Describe the meal, ingredients, and flavors.'
                                            className='resize-none'
                                            required
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='mt-6 flex justify-end gap-4'>
                            <Button type='submit' disabled={!form.formState.isDirty}>
                                Save
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button type='button' variant='destructive'>
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogTitle>Are you sure you want to delete {meal?.name}?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your meal.
                                    </AlertDialogDescription>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDeleteMeal}>Delete</AlertDialogAction>
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
