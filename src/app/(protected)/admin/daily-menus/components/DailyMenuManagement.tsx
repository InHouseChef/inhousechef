'use client'

import { createDailyMenu, ReadDailyMenuResponse, readDailyMenus, removeMealFromDailyMenu } from '@/apis/daily-menus'
import { deleteDailyMenu } from '@/apis/daily-menus/repository/hooks/deleteDailyMenu'
import { ReadMealResponse, readMeals } from '@/apis/meals'
import { Header, Loader } from '@/components'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Form } from '@/components/ui/form'
import { DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST } from '@/constants'
import { toDateIso } from '@/utils/date'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

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

export const DailyMenuManagement = () => {
    const [meals, setMeals] = useState<ReadMealResponse[]>([])
    const [dailyMenus, setDailyMenus] = useState<ReadDailyMenuResponse[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Local states for handling dates, selected meals, and modes
    const [selectedDates, setSelectedDates] = useState<Date[]>([])
    const [selectedMeals, setSelectedMeals] = useState<ReadMealResponse[]>([])
    const [isAssignmentMode, setIsAssignmentMode] = useState(false)
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
    const [value, setValue] = useState<string[]>([])
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

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
        keyName: 'key'
    })

    const initialFetch = async () => {
        const mealsResult = await readMeals({
            path: '',
            query: { pagination: { ...DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST } }
        })
        setMeals(mealsResult.results.flat())
        const { firstDay, lastDay } = getFirstAndLastDayOfMonth(currentMonth)
        const dailyMenusResult = await readDailyMenus({
            path: '',
            query: {
                pagination: { ...DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST },
                filter: { from: firstDay, to: lastDay }
            }
        })
        setDailyMenus(dailyMenusResult)
    }

    useEffect(() => {
        setIsLoading(true)
        initialFetch()
        setIsLoading(false)
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

    const toggleDeleteConfirmation = () => {
        setShowDeleteConfirmation(!showDeleteConfirmation)
    }

    const confirmDeleteDailyMenu = () => {
        const dailyMenuId = dailyMenus.find(
            menu => new Date(menu.date).toDateString() === selectedDates[0].toDateString()
        )!.id
        deleteDailyMenu({ path: { dailyMenuId } })
            .then(() => {
                initialFetch() // Refresh the data after deletion
                toggleDeleteConfirmation() // Close the confirmation dialog
            })
            .catch(error => {
                console.error('Error deleting daily menu:', error)
            })
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
            const selectedDailyMenu = dailyMenus?.find(
                menu => new Date(menu.date).toDateString() === dates[0].toDateString()
            )
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

    const handleDeleteMeal = (event: any, mealId: string) => {
        event.preventDefault() // Prevent the form from submitting
        const selectedDate = selectedDates[0]
        const dailyMenuId = dailyMenus.find(menu => new Date(menu.date).toDateString() === selectedDate.toDateString())!.id
        removeMealFromDailyMenu({ path: { dailyMenuId, mealId } })
            .then(() => {
                initialFetch()
                // optimistic update
                const meals = selectedMeals.filter(meal => meal.id !== mealId)
                setSelectedMeals(meals)
            })
            .catch(error => {
                console.error('Error removing meal from daily menu:', error)
            })
    }

    const onSubmit = () => {
        const dates = selectedDates.map(date => toDateIso(date))
        const mealIds = fields.map(meal => meal.id)
        createDailyMenu({ path: '', body: { dates, mealIds } }).then(_ => {
            setSelectedDates([])
            setSelectedMeals([])
            setValue([])
            initialFetch()
        })
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='h-full space-y-8'>
                <div className='flex items-center justify-between'>
                    <Header heading={isAssignmentMode ? 'Assign Meals to Dates' : 'View Daily Menu'} />
                    <Button type='button' variant='outline' onClick={toggleMode}>
                        {isAssignmentMode ? 'Switch to View Mode' : 'Switch to Assign Mode'}
                    </Button>
                </div>

                <div className='flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0'>
                    <Calendar
                        mode={isAssignmentMode ? 'multiple' : 'single'}
                        selected={selectedDates}
                        month={currentMonth}
                        // @ts-ignore
                        onSelect={handleDateSelection}
                        onMonthChange={onMonthChange}
                        className='rounded-lg bg-white shadow-lg'
                    />

                    <div className='flex-start relative flex min-w-[500px] flex-grow flex-col rounded-lg bg-white p-4 shadow-lg'>
                        <div className='mb-4 flex justify-between'>
                            <h3 className='text-lg font-semibold'>
                                {isAssignmentMode
                                    ? 'Assign Meals to Dates'
                                    : `Meals for ${selectedDates.length === 1 ? selectedDates[0].toDateString() : 'Selected Dates'}`}
                            </h3>
                            {!isAssignmentMode && selectedDates.length === 1 && selectedMeals.length > 0 && (
                                <Button type='button' variant='destructive' onClick={toggleDeleteConfirmation}>
                                    Delete Daily Menu
                                </Button>
                            )}
                        </div>
                        <div className='max-h-[500px] flex-grow overflow-y-auto'>
                            {!isAssignmentMode && selectedMeals.length > 0 && (
                                <div className='grid gap-4'>
                                    {selectedMeals.map(meal => (
                                        <div
                                            key={meal.id}
                                            className='flex items-center justify-between rounded-lg bg-gray-100 p-4 shadow-md'>
                                            <div className='flex items-center'>
                                                <div className='mr-4 h-20 w-20 flex-shrink-0 rounded-lg bg-gray-200'>
                                                    {meal.imageUrl ? (
                                                        <img
                                                            src={meal.imageUrl}
                                                            alt={meal.name}
                                                            className='h-20 w-20 rounded-lg object-cover'
                                                        />
                                                    ) : (
                                                        <div className='h-20 w-20 rounded-lg bg-gray-200'></div>
                                                    )}
                                                </div>
                                                <div className='flex-grow'>
                                                    <h4 className='text-md font-semibold'>{meal.name}</h4>
                                                    <p className='text-sm text-gray-600'>
                                                        <b>Description:</b> {meal.description}
                                                    </p>
                                                    <p className='text-sm text-gray-600'>
                                                        <b>Type:</b> {meal.type}
                                                    </p>
                                                    <p className='text-sm text-gray-600'>
                                                        <b>Purchase Price:</b> {meal.purchasePrice.toFixed(2)} RSD
                                                    </p>
                                                    <p className='text-sm text-gray-600'>
                                                        <b>Selling Price:</b> {meal.sellingPrice.toFixed(2)} RSD
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='ml-4 flex-shrink-0'>
                                                <Button
                                                    variant='destructive'
                                                    size='sm'
                                                    onClick={event => handleDeleteMeal(event, meal.id)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {!isAssignmentMode && selectedDates.length > 0 && selectedMeals.length === 0 && (
                                <div className='flex h-full items-center justify-center'>
                                    <p className='text-center text-gray-500'>No meals assigned for the selected day.</p>
                                </div>
                            )}
                            {!isAssignmentMode && selectedDates.length === 0 && (
                                <div className='flex h-full items-center justify-center'>
                                    <p className='text-center text-gray-500'>Please select a date to view the menu.</p>
                                </div>
                            )}
                            {isAssignmentMode && (
                                <div className='grid gap-4'>
                                    {meals.map(meal => (
                                        <div
                                            key={meal.id}
                                            className={`flex cursor-pointer items-center rounded-lg p-4 shadow-md ${value.includes(meal.id) ? 'bg-primary/10' : 'bg-gray-100'}`}
                                            onClick={() =>
                                                handleMealSelection(
                                                    value.includes(meal.id)
                                                        ? value.filter(id => id !== meal.id)
                                                        : [...value, meal.id]
                                                )
                                            }>
                                            <div className='mr-4 h-16 w-16 flex-shrink-0 rounded-lg bg-gray-200'>
                                                {meal.imageUrl ? (
                                                    <img
                                                        src={meal.imageUrl}
                                                        alt={meal.name}
                                                        className='h-full w-full rounded-lg object-cover'
                                                    />
                                                ) : (
                                                    <div className='h-full w-full rounded-lg bg-gray-200'></div>
                                                )}
                                            </div>
                                            <div className='flex-grow'>
                                                <h4 className='text-md font-semibold'>{meal.name}</h4>
                                                <p className='text-sm text-gray-600'>
                                                    <b>Description:</b> {meal.description}
                                                </p>
                                                <p className='text-sm text-gray-600'>
                                                    <b>Type:</b> {meal.type}
                                                </p>
                                                <p className='text-sm text-gray-600'>
                                                    <b>Purchase Price:</b> {meal.purchasePrice.toFixed(2)} RSD
                                                </p>
                                                <p className='text-sm text-gray-600'>
                                                    <b>Selling Price:</b> {meal.sellingPrice.toFixed(2)} RSD
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {isAssignmentMode && (
                            <>
                                {value.length === 0 && selectedDates.length === 0 && (
                                    <Button type='submit' className='mt-4 w-full' disabled>
                                        Please select a date and at least one meal
                                    </Button>
                                )}
                                {value.length === 0 && selectedDates.length > 0 && (
                                    <Button type='submit' className='mt-4 w-full' disabled>
                                        Please select at least one meal
                                    </Button>
                                )}
                                {value.length > 0 && selectedDates.length === 0 && (
                                    <Button type='submit' className='mt-4 w-full' disabled>
                                        Please select a date
                                    </Button>
                                )}
                                {value.length > 0 && selectedDates.length > 0 && (
                                    <Button type='submit' className='mt-4 w-full'>
                                        Assign Meals
                                    </Button>
                                )}
                            </>
                        )}
                        {/* Overlay for delete confirmation */}
                        {!isAssignmentMode &&
                            selectedDates.length === 1 &&
                            selectedMeals.length > 0 &&
                            showDeleteConfirmation && (
                                <div className='absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50'>
                                    <div className='rounded-lg bg-white p-6 shadow-lg'>
                                        <h4 className='mb-4 text-lg font-semibold'>
                                            Are you sure you want to delete this daily menu?
                                        </h4>
                                        <div className='flex justify-end space-x-4'>
                                            <Button variant='outline' onClick={toggleDeleteConfirmation}>
                                                Cancel
                                            </Button>
                                            <Button variant='destructive' onClick={confirmDeleteDailyMenu}>
                                                Confirm
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </form>
        </Form>
    )
}
