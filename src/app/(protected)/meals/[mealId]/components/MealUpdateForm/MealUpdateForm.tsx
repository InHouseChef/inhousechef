'use client'

import { updateMeal, useDeleteMeal, useReadMeal } from '@/api/meals'
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
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'

import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { updateMealSchema } from '../../../schemas'

interface MealUpdateFormProps {
    mealId: string
}

export const MealUpdateForm = ({ mealId }: MealUpdateFormProps) => {
    const { data: meal, isLoading } = useReadMeal({ path: { mealId } })
    const { mutate: deleteMeal } = useDeleteMeal()
    const router = useRouter()

    const form = useForm<z.infer<typeof updateMealSchema>>({
        resolver: zodResolver(updateMealSchema)
    })

    const { control, reset, handleSubmit } = form

    // TODO: fix file upload
    useEffect(() => {
        if (!meal) return
        reset(meal)
    }, [meal])

    if (isLoading) {
        return <Loader />
    }

    const onSubmit = (formData: z.infer<typeof updateMealSchema>) => updateMeal({ path: { mealId }, body: formData })

    const handleDeleteMeal = () => deleteMeal({ path: { mealId } }, { onSuccess: () => router.push('/meals') })

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='h-full'>
                <Header heading='Meal Information' />
                <div className='grid grid-cols-12'>
                    <div className='col-span-6'>
                        <div className='grid grid-cols-12 gap-3'>
                            <div className='col-span-8'>
                                <FormField
                                    control={control}
                                    name='name'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Meal Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder='Cezar salata' required />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-8'>
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
                            </div>
                            <div className='col-span-8'>
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
                            </div>
                        </div>
                    </div>
                    <div className='col-span-6'>
                        <div className='flex h-64 items-center justify-center rounded-lg'>
                            <h2 className='text-center text-3xl'>Image</h2>

                            {/* TODO: insert meal image here */}
                            {/* <Image
                                src={<Logo />}
                                alt='Meal image'
                                className='h-32'
                                width={500}
                                height={500}
                            /> */}
                        </div>
                    </div>
                    <div className='col-span-12'>
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
                    </div>
                </div>
                <div className='mt-4'></div>
                <div className='mt-8 flex items-center justify-end'>
                    <div className='flex items-center gap-2'>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button type='button' variant='destructive'>
                                    Delete Meal
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to delete {meal?.name}?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your meal.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteMeal}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <Button>Update Meal</Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}
