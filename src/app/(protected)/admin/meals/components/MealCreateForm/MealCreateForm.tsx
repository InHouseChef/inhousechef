'use client'

import { useCreateMeal } from '@/apis/meals'
import { Header } from '@/components'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createMealSchema } from '../../schemas'

export const MealCreateForm = () => {
    const router = useRouter()
    const { mutate: createMeal, isPending } = useCreateMeal()

    const form = useForm<z.infer<typeof createMealSchema>>({
        resolver: zodResolver(createMealSchema)
    })

    const { control, handleSubmit } = form

    const onSubmit = async (formData: z.infer<typeof createMealSchema>) => {
        await createMeal(
            { path: {}, body: formData },
            {
                onSuccess: data => {
                    router.push(`/admin/meals/${data.id}`)
                }
            }
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                <Header heading='Create Meal' />
                <div className='grid grid-cols-12 gap-4'>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Name<span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value || ''} placeholder='Cezar salata' required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='purchasePrice'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Purchase Price<span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value || ''}
                                            placeholder='30 rsd'
                                            required
                                            type='number'
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
                            name='sellingPrice'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Selling Price<span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            value={field.value || ''}
                                            placeholder='50 rsd'
                                            required
                                            type='number'
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
                            name='type'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Type<span className='text-red-500'>*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange}>
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
                    </div>
                    <div className='col-span-12'>
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
                                            {...field}
                                            value={field.value || ''}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className='mt-8 flex items-center justify-end'>
                    <Button loading={isPending} type='submit'>
                        Create Meal
                    </Button>
                </div>
            </form>
        </Form>
    )
}
