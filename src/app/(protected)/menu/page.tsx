'use client'

import { useCreateDailyMenu } from '@/api/daily-menus'
import { ReadMealResponse, useReadMeals } from '@/api/meals'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Form, FormField } from '@/components/ui/form'
import {
    MultiSelector,
    MultiSelectorContent,
    MultiSelectorInput,
    MultiSelectorItem,
    MultiSelectorList,
    MultiSelectorTrigger
} from '@/components/ui/multiselect'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { createDailyMenusSchema } from './schemas'

interface MenuScheduleFormData {
    meals: ReadMealResponse[]
    dates: Date[]
}

const MealScheduler = () => {
    const form = useForm<MenuScheduleFormData>({
        defaultValues: {
            dates: [],
            meals: []
        }
    })

    const { control, handleSubmit } = form

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'meals'
    })

    const { data: meals } = useReadMeals()
    const [selectedDates, setSelectedDates] = useState<Date[]>([])
    const [value, setValue] = useState<string[]>([])

    const { mutate: createDailyMenu } = useCreateDailyMenu()

    const handleDateSelection = (dates: Date[]) => {
        setSelectedDates(dates)
    }

    const handleMealSelection = (selectedValues: string[]) => {
        setValue(selectedValues)
        form.setValue(
            'meals',
            selectedValues
                .map(id => meals?.results.find(meal => meal.id === id))
                .filter(meal => meal !== undefined) as ReadMealResponse[]
        )
    }

    const onSubmit = (formData: z.infer<typeof createDailyMenusSchema>) => {
        createDailyMenu(
            { path: '', body: formData },
            {
                onSuccess: data => {}
            }
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                <Calendar
                    mode='multiple'
                    selected={selectedDates}
                    onSelect={handleDateSelection}
                    className='rounded-md border'
                />

                {selectedDates.length > 0 ? (
                    <>
                        <h2 className='mt-8 text-center text-2xl font-semibold'>Select Meals for the Selected Days</h2>
                        <div className='space-y-4'>
                            <FormField
                                control={control}
                                name='meals'
                                render={({ field }) => (
                                    <MultiSelector
                                        onValuesChange={handleMealSelection}
                                        values={value}
                                        loop
                                        className='max-w-xs'>
                                        <MultiSelectorTrigger>
                                            <MultiSelectorInput placeholder='Select your meals' />
                                        </MultiSelectorTrigger>
                                        <MultiSelectorContent>
                                            <MultiSelectorList>
                                                {meals?.results.map(meal => (
                                                    <MultiSelectorItem key={meal.id} value={meal.id}>
                                                        {meal.name}
                                                    </MultiSelectorItem>
                                                ))}
                                            </MultiSelectorList>
                                        </MultiSelectorContent>
                                    </MultiSelector>
                                )}
                            />
                            {fields.map((field, index) => (
                                <div key={field.id} className='flex items-center'>
                                    <span>{meals?.results.find(meal => meal.id === field.id)?.name}</span>
                                </div>
                            ))}
                        </div>
                        <Button type='button' variant='outline'>
                            Assign
                        </Button>
                    </>
                ) : null}
                <Button type='submit'>Create Menu</Button>
            </form>
        </Form>
    )
}

export default MealScheduler
