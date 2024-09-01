'use client'

import { createALaCardMenu, ReadALaCardMenuResponse, readALaCardMenus, removeMealFromALaCardMenu } from '@/apis/alacard-menus'
import { deleteALaCardMenu } from '@/apis/alacard-menus/repository/hooks/deleteALaCardMenu'
import { ReadMealResponse, readMeals } from '@/apis/meals'
import { Header, Loader } from '@/components'
import { Button, buttonVariants } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST } from '@/constants'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'

interface MenuScheduleFormData {
    meals: ReadMealResponse[]
    dates: Date[]
}

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

export const ALaCardMenuManagement = () => {
    const [meals, setMeals] = useState<ReadMealResponse[]>([])
    const [aLaCardMenus, setALaCardMenus] = useState<ReadALaCardMenuResponse[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedMonths, setSelectedMonths] = useState<number[]>([])
    const [selectedMeals, setSelectedMeals] = useState<ReadMealResponse[]>([])
    const [isAssignmentMode, setIsAssignmentMode] = useState(false)
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())
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
        const firstDay = `${currentYear}-01-01`
        const lastDay = `${currentYear}-12-31`
        const aLaCardMenusResult = await readALaCardMenus({
            path: '',
            query: {
                pagination: { ...DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST },
                filter: { from: firstDay, to: lastDay }
            }
        })
        setALaCardMenus(aLaCardMenusResult)
    }

    useEffect(() => {
        setIsLoading(true)
        initialFetch()
        setIsLoading(false)
    }, [currentYear])

    const toggleMode = () => {
        setIsAssignmentMode(!isAssignmentMode)
        setSelectedMonths([])
        setSelectedMeals([])
        setValue([])
    }

    const handleMonthSelection = (monthIndex: number) => {
        if (!isAssignmentMode) {
            const selectedALaCardMenu = aLaCardMenus?.find(
                menu => new Date(menu.date).getMonth() === monthIndex && new Date(menu.date).getFullYear() === currentYear
            )
            const selectedMeals =
                selectedALaCardMenu?.meals.map(aLaCardMenuMeal => meals.find(meal => meal.id === aLaCardMenuMeal.id)) || []
            setSelectedMeals(selectedMeals as ReadMealResponse[])
            setSelectedMonths([monthIndex])
        } else {
            // Toggle the month selection on and off
            setSelectedMonths(prev =>
                prev.includes(monthIndex) ? prev.filter(m => m !== monthIndex) : [...prev, monthIndex]
            )
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
        const aLaCardMenuId = aLaCardMenus.find(
            menu =>
                selectedMonths.includes(new Date(menu.date).getMonth()) && new Date(menu.date).getFullYear() === currentYear
        )!.id
        removeMealFromALaCardMenu({ path: { aLaCardMenuId, mealId } })
            .then(() => {
                initialFetch()
                // optimistic update
                const meals = selectedMeals.filter(meal => meal.id !== mealId)
                setSelectedMeals(meals)
            })
            .catch(error => {
                console.error('Error removing meal from aLaCard menu:', error)
            })
    }

    const toggleDeleteConfirmation = () => {
        setShowDeleteConfirmation(!showDeleteConfirmation)
    }

    const handleDeleteALaCardMenu = () => {
        const aLaCardMenuId = aLaCardMenus.find(
            menu =>
                selectedMonths.includes(new Date(menu.date).getMonth()) && new Date(menu.date).getFullYear() === currentYear
        )!.id
        deleteALaCardMenu({ path: { aLaCardMenuId } })
            .then(() => {
                initialFetch() // Refresh the data after deletion
                toggleDeleteConfirmation() // Close the confirmation dialog
            })
            .catch(error => {
                console.error('Error deleting aLaCard menu:', error)
            })
    }

    const onSubmit = () => {
        const dates = selectedMonths.map(monthIndex => `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-01`)
        const mealIds = fields.map(meal => meal.id)
        createALaCardMenu({ path: '', body: { dates, mealIds } }).then(_ => {
            setSelectedMonths([])
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
                    <Header heading={isAssignmentMode ? 'Assign Meals to Months' : 'View Monthly Menu'} />
                    <Button type='button' variant='outline' onClick={toggleMode}>
                        {isAssignmentMode ? 'Switch to View Mode' : 'Switch to Assign Mode'}
                    </Button>
                </div>

                <div className='flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0'>
                    <div className='rdp rounded-lg bg-white p-3 shadow-lg lg:w-[500px] xl:w-[500px] 2xl:w-[500px]'>
                        <div className='rdp-caption_start rdp-caption_end space-y-4'>
                            <div className='mb-4 flex w-full items-center justify-between'>
                                <Button
                                    className={cn(
                                        buttonVariants({ variant: 'outline' }),
                                        'rdp-button_reset rdp-button inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-md border border-input bg-transparent p-0 text-sm font-medium opacity-50 ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
                                    )}
                                    variant='outline'
                                    onClick={() => setCurrentYear(currentYear - 1)}>
                                    <ChevronLeft className='h-4 w-4' />
                                </Button>
                                <h3 className='text-lg font-semibold'>{currentYear}</h3>
                                <Button
                                    className={cn(
                                        buttonVariants({ variant: 'outline' }),
                                        'rdp-button_reset rdp-button inline-flex h-9 w-9 items-center justify-center whitespace-nowrap rounded-md border border-input bg-transparent p-0 text-sm font-medium opacity-50 ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
                                    )}
                                    variant='outline'
                                    onClick={() => setCurrentYear(currentYear + 1)}>
                                    <ChevronRight className='h-4 w-4' />
                                </Button>
                            </div>
                            <table className='w-full border-collapse'>
                                <tbody className='rdp-tbody'>
                                    {Array(3)
                                        .fill(null)
                                        .map((_, rowIndex) => (
                                            <tr key={rowIndex} className='flex justify-center'>
                                                {months.slice(rowIndex * 4, rowIndex * 4 + 4).map((month, index) => {
                                                    const monthIndex = rowIndex * 4 + index
                                                    return (
                                                        <td
                                                            key={monthIndex}
                                                            className={`m-2 cursor-pointer rounded-lg p-4 text-center ${
                                                                selectedMonths.includes(monthIndex)
                                                                    ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground'
                                                                    : 'bg-gray-100 hover:bg-accent hover:text-accent-foreground'
                                                            } rdp-button_reset rdp-button inline-flex h-24 w-24 items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`}
                                                            onClick={() => handleMonthSelection(monthIndex)}>
                                                            {month}
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className='flex-start relative flex min-w-[500px] flex-grow flex-col rounded-lg bg-white p-4 shadow-lg lg:w-2/3'>
                        <div className='mb-4 flex justify-between'>
                            <h3 className='text-lg font-semibold'>
                                {isAssignmentMode ? 'Assign Meals to Months' : 'Meals for Selected Months'}
                            </h3>
                            {!isAssignmentMode && selectedMonths.length === 1 && selectedMeals.length > 0 && (
                                <Button type='button' variant='destructive' onClick={toggleDeleteConfirmation}>
                                    Delete Monthly Menu
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
                            {!isAssignmentMode && selectedMonths.length > 0 && selectedMeals.length === 0 && (
                                <div className='flex h-full items-center justify-center'>
                                    <p className='text-center text-gray-500'>No meals assigned for the selected month(s).</p>
                                </div>
                            )}
                            {!isAssignmentMode && selectedMonths.length === 0 && (
                                <div className='flex h-full items-center justify-center'>
                                    <p className='text-center text-gray-500'>Please select a month to view the menu.</p>
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
                                {value.length === 0 && selectedMonths.length === 0 && (
                                    <Button type='submit' className='mt-4 w-full' disabled>
                                        Please select a month and at least one meal
                                    </Button>
                                )}
                                {value.length === 0 && selectedMonths.length > 0 && (
                                    <Button type='submit' className='mt-4 w-full' disabled>
                                        Please select at least one meal
                                    </Button>
                                )}
                                {value.length > 0 && selectedMonths.length === 0 && (
                                    <Button type='submit' className='mt-4 w-full' disabled>
                                        Please select a month
                                    </Button>
                                )}
                                {value.length > 0 && selectedMonths.length > 0 && (
                                    <Button type='submit' className='mt-4 w-full'>
                                        Assign Meals
                                    </Button>
                                )}
                            </>
                        )}
                        {!isAssignmentMode &&
                            selectedMonths.length === 1 &&
                            selectedMeals.length > 0 &&
                            showDeleteConfirmation && (
                                <div className='absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50'>
                                    <div className='rounded-lg bg-white p-6 shadow-lg'>
                                        <h4 className='mb-4 text-lg font-semibold'>
                                            Are you sure you want to delete this monthly menu?
                                        </h4>
                                        <div className='flex justify-end space-x-4'>
                                            <Button variant='outline' onClick={toggleDeleteConfirmation}>
                                                Cancel
                                            </Button>
                                            <Button variant='destructive' onClick={handleDeleteALaCardMenu}>
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
