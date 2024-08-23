'use client'

import { createDailyMenu, ReadDailyMenuResponse, readDailyMenus } from '@/api/daily-menus'
import { ReadMealResponse, readMeals } from '@/api/meals'
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
import { useState, useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toDateIso } from '@/utils/date'
import { Header, Loader } from '@/components'
import { DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST } from '@/constants'

interface MenuScheduleFormData {
    meals: ReadMealResponse[]
    dates: Date[]
}

// Calculate the first and last day of the month based on the selected month
const getFirstAndLastDayOfMonth = (date: Date) => {
    const firstDay = toDateIso(new Date(date.getFullYear(), date.getMonth(), 1))
    const lastDay = toDateIso(new Date(date.getFullYear(), date.getMonth() + 1, 0))
    return { firstDay, lastDay }
}

export const MealScheduler = () => {
    const [meals, setMeals] = useState<ReadMealResponse[]>([])
    const [dailyMenus, setDailyMenus] = useState<ReadDailyMenuResponse[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Local states for handling dates, selected meals, and modes
    const [selectedDates, setSelectedDates] = useState<Date[]>([])
    const [selectedMeals, setSelectedMeals] = useState<ReadMealResponse[]>([])
    const [isAssignmentMode, setIsAssignmentMode] = useState(false)
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
    const [value, setValue] = useState<string[]>([])

    const form = useForm<MenuScheduleFormData>({
        defaultValues: {
            dates: [],
            meals: []
        }
    })

    const { control, handleSubmit } = form
    const { fields } = useFieldArray({
        control,
        name: 'meals',
        keyName: "key"
    })

    const initialFetch = async () => {
        setIsLoading(true)
        const mealsResult = await readMeals({ path: '', query: { pagination: { ...DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST }}})
        setMeals(mealsResult.results)
        const { firstDay, lastDay } = getFirstAndLastDayOfMonth(currentMonth)
        const dailyMenusResult = await readDailyMenus({ path: '', query: { pagination: {...DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST}, filter: {from: firstDay, to: lastDay}}})
        setDailyMenus(dailyMenusResult)
        setIsLoading(false)
    }

    useEffect(() => {
        initialFetch()
    }, [currentMonth])

    const toggleMode = () => {
        setIsAssignmentMode(!isAssignmentMode)
        setSelectedDates([])
        setSelectedMeals([])
        setValue([])
    }

    const onMonthChange = (date: Date) => {
        setCurrentMonth(date)
    }

    const handleDateSelection = (dates: Date[] | Date | undefined) => {
        if (dates === undefined) {
            setSelectedDates([])
            setSelectedMeals([])
            return
        }

        if (!Array.isArray(dates)) {
            dates = [dates]
        }

        setSelectedDates(dates)
        if (!isAssignmentMode && dates.length === 1) {
            const selectedDailyMenu = dailyMenus?.find(menu => new Date(menu.date).toDateString() === dates[0].toDateString())
            const selectedMeals = []
            if (selectedDailyMenu) {
                for (const dailyMenuMeal of selectedDailyMenu.meals) {
                    const meal = meals.find(meal => meal.id === dailyMenuMeal.id)
                    if (meal) {
                        selectedMeals.push(meal)
                    }
                }
            }
            setSelectedMeals(selectedMeals || [])
        }
    }

    const handleMealSelection = (selectedValues: string[]) => {
        setValue(selectedValues)
        form.setValue(
            'meals',
            selectedValues
                .map(id => meals?.find(meal => meal.id === id))
                .filter(meal => meal !== undefined) as ReadMealResponse[]
        )
    }

    const onSubmit = () => {
        const dates = selectedDates.map(date => toDateIso(date))
        const mealIds = fields.map(meal => meal.id)
        createDailyMenu(
            { path: '', body: { dates, mealIds } }
        ).then(res => {
            setSelectedDates([])
            setSelectedMeals([])
            setValue([])
            setIsAssignmentMode(!isAssignmentMode)
            initialFetch()
        })
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8 h-full'>
                <div className="flex justify-between items-center">
                    <Header heading={isAssignmentMode ? 'Assign Meals to Dates' : 'View Daily Menu'} />
                    <Button type="button" variant="outline" onClick={toggleMode}>
                        {isAssignmentMode ? 'Switch to View Mode' : 'Switch to Assign Mode'}
                    </Button>
                </div>

                <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                    <Calendar
                        mode={isAssignmentMode ? 'multiple' : 'single'}
                        selected={selectedDates}
                        month={currentMonth}
                        onSelect={handleDateSelection}
                        onMonthChange={onMonthChange}
                        className="bg-white shadow-lg rounded-lg"
                    />

                    <div className="flex-grow min-w-[300px] bg-white shadow-lg rounded-lg p-4 flex flex-col justify-between">
                        <div className="flex-grow">
                            <h3 className="text-lg font-semibold mb-4">
                                {isAssignmentMode ? 'Assign Meals to Dates' : `Meals for ${selectedDates.length === 1 ? selectedDates[0].toDateString() : 'Selected Dates'}`}
                            </h3>
                            {!isAssignmentMode && selectedMeals.length > 0 && (
                                <div className="grid gap-4 max-h-100 overflow-y-auto">
                                    {selectedMeals.map(meal => (
                                        <div key={meal.id} className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center">
                                            {meal.imageUrl && (
                                                <img src={meal.imageUrl} alt={meal.name} className="w-16 h-16 rounded-lg mr-4" />
                                            )}
                                            <div>
                                                <h4 className="text-md font-semibold">{meal.name}</h4>
                                                <p className="text-sm text-gray-600"><b>Description:</b> {meal.description}</p>
                                                <p className='text-sm text-gray-600'><b>Type:</b> {meal.type}</p>
                                                <p className="text-sm text-gray-600">
                                                    <b>Purchase Price:</b> {meal.purchasePrice.toFixed(2)} RSD | <b>Selling Price:</b> {meal.sellingPrice.toFixed(2)} RSD
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {!isAssignmentMode && selectedDates.length > 0 && selectedMeals.length === 0 && (
                                <p className="text-gray-500">No meals assigned for the selected day</p>
                            )}
                            {!isAssignmentMode && selectedDates.length === 0 && (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-500 text-center">Please select a date to view the menu.</p>
                                </div>
                            )}
                            {isAssignmentMode && selectedDates.length > 0 && (
                                <>
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
                                                        {meals?.map(meal => (
                                                            <MultiSelectorItem key={meal.id} value={meal.id}>
                                                                {meal.name}
                                                            </MultiSelectorItem>
                                                        ))}
                                                    </MultiSelectorList>
                                                </MultiSelectorContent>
                                            </MultiSelector>
                                        )}
                                    />
                                </>
                            )}
                        </div>
                        {isAssignmentMode && selectedDates.length > 0 && (
                            <Button type='submit' className="w-full mt-4" disabled={value.length === 0}>Assign Meals</Button>
                        )}
                    </div>
                </div>
            </form>
        </Form>
    )
}
