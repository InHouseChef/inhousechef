'use client'

import { useCreateMeal } from '@/api/meals'
import { Header } from '@/components'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createMealSchema } from '../../schemas'

export const MealCreateForm = () => {
    const router = useRouter()
    const { mutate: createMeal } = useCreateMeal()
    const form = useForm<z.infer<typeof createMealSchema>>({
        resolver: zodResolver(createMealSchema)
    })

    const { control, handleSubmit } = form

    const onSubmit = (formData: z.infer<typeof createMealSchema>) => {
        createMeal(
            { path: {}, body: formData },
            {
                // onSuccess: data => {
                //     router.push(`/meal/${data.id}`)
                // }
            }
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                <Header heading='Create Meal' />
                <div className='grid grid-cols-12 gap-3'>
                    <div className='col-span-6 space-y-4'>
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
                        <FormField
                            control={control}
                            name='purchasePrice'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Purchase Price</FormLabel>
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
                                    <FormLabel>Selling Price</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder='50 rsd' required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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

                <div className='mt-8 flex items-center justify-end'>
                    <Button>Create Meal</Button>
                </div>
            </form>
        </Form>
    )
}
