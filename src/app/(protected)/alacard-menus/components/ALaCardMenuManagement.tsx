'use client'

import { ReadMealResponse, readMeals } from '@/api/meals'
import { Button, buttonVariants } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { useState, useEffect } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Header, Loader } from '@/components'
import { DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST } from '@/constants'
import { createALaCardMenu, ReadALaCardMenuResponse, readALaCardMenus, removeMealFromALaCardMenu } from '@/api/alacard-menus'
import { deleteALaCardMenu } from '@/api/alacard-menus/repository/hooks/deleteALaCardMenu'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'


interface MenuScheduleFormData {
    meals: ReadMealResponse[]
    dates: Date[]
}

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
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
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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
        const mealsResult = await readMeals({ path: '', query: { pagination: { ...DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST }}})
        setMeals(mealsResult.results)
        const firstDay = `${currentYear}-01-01`
        const lastDay = `${currentYear}-12-31`
        const aLaCardMenusResult = await readALaCardMenus({ path: '', query: { pagination: {...DEFAULT_COLLECTION_OFFSET_PAGINATION_REQUEST}, filter: {from: firstDay, to: lastDay}}})
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
            const selectedALaCardMenu = aLaCardMenus?.find(menu => new Date(menu.date).getMonth() === monthIndex && new Date(menu.date).getFullYear() === currentYear);
            const selectedMeals = selectedALaCardMenu?.meals.map(aLaCardMenuMeal => meals.find(meal => meal.id === aLaCardMenuMeal.id)) || [];
            setSelectedMeals(selectedMeals as ReadMealResponse[]);
            setSelectedMonths([monthIndex]);
        } else {
            // Toggle the month selection on and off
            setSelectedMonths(prev =>
                prev.includes(monthIndex)
                    ? prev.filter(m => m !== monthIndex)
                    : [...prev, monthIndex]
            );
        }
    };

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
        const aLaCardMenuId = aLaCardMenus.find(menu => selectedMonths.includes(new Date(menu.date).getMonth()) && new Date(menu.date).getFullYear() === currentYear)!.id
        removeMealFromALaCardMenu({ path: { aLaCardMenuId, mealId }})
            .then(() => {
                initialFetch(); 
                // optimistic update
                const meals = selectedMeals.filter(meal => meal.id !== mealId)
                setSelectedMeals(meals)
            })
            .catch(error => {
                console.error("Error removing meal from aLaCard menu:", error);
            });
    };

    const toggleDeleteConfirmation = () => {
        setShowDeleteConfirmation(!showDeleteConfirmation);
    };

    const handleDeleteALaCardMenu = () => {
        const aLaCardMenuId = aLaCardMenus.find(menu => selectedMonths.includes(new Date(menu.date).getMonth()) && new Date(menu.date).getFullYear() === currentYear)!.id
        deleteALaCardMenu({ path: { aLaCardMenuId }})
            .then(() => {
                initialFetch();  // Refresh the data after deletion
                toggleDeleteConfirmation();  // Close the confirmation dialog
            })
            .catch(error => {
                console.error("Error deleting aLaCard menu:", error);
            });
    }

    const onSubmit = () => {
        const dates = selectedMonths.map(monthIndex => `${currentYear}-${String(monthIndex + 1).padStart(2, '0')}-01`)
        const mealIds = fields.map(meal => meal.id)
        createALaCardMenu(
            { path: '', body: { dates, mealIds } }
        ).then(_ => {
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
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8 h-full'>
                <div className="flex justify-between items-center">
                    <Header heading={isAssignmentMode ? 'Assign Meals to Months' : 'View Monthly Menu'} />
                    <Button type="button" variant="outline" onClick={toggleMode}>
                        {isAssignmentMode ? 'Switch to View Mode' : 'Switch to Assign Mode'}
                    </Button>
                </div>
    
                <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
                    <div className="lg:w-[500px] xl:w-[500px] 2xl:w-[500px] bg-white shadow-lg rounded-lg p-3 rdp">
                        <div className='space-y-4 rdp-caption_start rdp-caption_end'>
                            <div className="flex justify-between items-center w-full mb-4">
                                <Button
                                className={cn(
                                    buttonVariants({ variant: "outline" }),
                                    "h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100 rdp-button_reset rdp-button inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground"
                                )}
                                variant="outline"
                                onClick={() => setCurrentYear(currentYear - 1)}
                                >
                                <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <h3 className="text-lg font-semibold">{currentYear}</h3>
                                <Button
                                className={cn(
                                    buttonVariants({ variant: "outline" }),
                                    "h-9 w-9 bg-transparent p-0 opacity-50 hover:opacity-100 rdp-button_reset rdp-button inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground"
                                )}
                                variant="outline"
                                onClick={() => setCurrentYear(currentYear + 1)}
                                >
                                <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                            <table className="w-full border-collapse">
                                <tbody className="rdp-tbody">
                                {Array(3)
                                    .fill(null)
                                    .map((_, rowIndex) => (
                                    <tr key={rowIndex} className="flex justify-center">
                                        {months.slice(rowIndex * 4, rowIndex * 4 + 4).map((month, index) => {
                                        const monthIndex = rowIndex * 4 + index;
                                        return (
                                            <td
                                            key={monthIndex}
                                            className={`cursor-pointer p-4 m-2 rounded-lg text-center ${
                                                selectedMonths.includes(monthIndex)
                                                ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground"
                                                : "bg-gray-100 hover:bg-accent hover:text-accent-foreground"
                                            } h-24 w-24 text-sm rdp-button_reset rdp-button inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50`}
                                            onClick={() => handleMonthSelection(monthIndex)}
                                            >
                                            {month}
                                            </td>
                                        );
                                        })}
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex-grow lg:w-2/3 min-w-[500px] bg-white shadow-lg rounded-lg p-4 flex flex-col flex-start relative">
                        <div className='flex justify-between mb-4'>
                            <h3 className="text-lg font-semibold">
                                {isAssignmentMode ? 'Assign Meals to Months' : `Meals for Selected Months`}
                            </h3>
                            {!isAssignmentMode && selectedMonths.length === 1 && selectedMeals.length > 0 && (
                                <Button type="button" variant="destructive" onClick={toggleDeleteConfirmation}>
                                    Delete Monthly Menu
                                </Button>
                            )}
                        </div>
                        <div className="flex-grow max-h-[500px] overflow-y-auto">
                            {!isAssignmentMode && selectedMeals.length > 0 && (
                                <div className="grid gap-4">
                                    {selectedMeals.map(meal => (
                                        <div key={meal.id} className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center justify-between">
                                            <div className="flex items-center">
                                                <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-lg mr-4">
                                                    {meal.imageUrl ? (
                                                        <img
                                                            src={meal.imageUrl}
                                                            alt={meal.name}
                                                            className="w-20 h-20 object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                                                    )}
                                                </div>
                                                <div className="flex-grow">
                                                    <h4 className="text-md font-semibold">{meal.name}</h4>
                                                    <p className="text-sm text-gray-600"><b>Description:</b> {meal.description}</p>
                                                    <p className='text-sm text-gray-600'><b>Type:</b> {meal.type}</p>
                                                    <p className='text-sm text-gray-600'><b>Purchase Price:</b> {meal.purchasePrice.toFixed(2)} RSD</p>
                                                    <p className='text-sm text-gray-600'><b>Selling Price:</b> {meal.sellingPrice.toFixed(2)} RSD</p>
                                                </div>
                                            </div>
                                            <div className="ml-4 flex-shrink-0">
                                                <Button 
                                                    variant="destructive" 
                                                    size="sm" 
                                                    onClick={(event) => handleDeleteMeal(event, meal.id)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {!isAssignmentMode && selectedMonths.length > 0 && selectedMeals.length === 0 && (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-500 text-center">No meals assigned for the selected month(s).</p>
                                </div>
                            )}
                            {!isAssignmentMode && selectedMonths.length === 0 && (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-gray-500 text-center">Please select a month to view the menu.</p>
                                </div>
                            )}
                            {isAssignmentMode && (
                                <div className="grid gap-4">
                                    {meals.map(meal => (
                                        <div
                                        key={meal.id}
                                        className={`p-4 rounded-lg shadow-md flex items-center cursor-pointer ${value.includes(meal.id) ? 'bg-primary/10' : 'bg-gray-100'}`}
                                        onClick={() => handleMealSelection(value.includes(meal.id) ? value.filter(id => id !== meal.id) : [...value, meal.id])}
                                    >
                                        <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded-lg mr-4">
                                            {meal.imageUrl ? (
                                                <img src={meal.imageUrl} alt={meal.name} className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <div className="w-full h-full bg-gray-200 rounded-lg"></div>
                                            )}
                                        </div>
                                        <div className="flex-grow">
                                            <h4 className="text-md font-semibold">{meal.name}</h4>
                                            <p className="text-sm text-gray-600"><b>Description:</b> {meal.description}</p>
                                            <p className='text-sm text-gray-600'><b>Type:</b> {meal.type}</p>
                                            <p className='text-sm text-gray-600'><b>Purchase Price:</b> {meal.purchasePrice.toFixed(2)} RSD</p>
                                            <p className='text-sm text-gray-600'><b>Selling Price:</b> {meal.sellingPrice.toFixed(2)} RSD</p>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {isAssignmentMode && (
                            <>
                                {value.length === 0 && selectedMonths.length === 0 && (
                                    <Button type='submit' className="w-full mt-4" disabled>
                                        Please select a month and at least one meal
                                    </Button>
                                )}
                                {value.length === 0 && selectedMonths.length > 0 && (
                                    <Button type='submit' className="w-full mt-4" disabled>
                                        Please select at least one meal
                                    </Button>
                                )}
                                {value.length > 0 && selectedMonths.length === 0 && (
                                    <Button type='submit' className="w-full mt-4" disabled>
                                        Please select a month
                                    </Button>
                                )}
                                {value.length > 0 && selectedMonths.length > 0 && (
                                    <Button type='submit' className="w-full mt-4">
                                        Assign Meals
                                    </Button>
                                )}
                            </>
                        )}
                        {!isAssignmentMode && selectedMonths.length === 1 && selectedMeals.length > 0 && showDeleteConfirmation && (
                            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                                <div className="bg-white p-6 rounded-lg shadow-lg">
                                    <h4 className="text-lg font-semibold mb-4">Are you sure you want to delete this monthly menu?</h4>
                                    <div className="flex justify-end space-x-4">
                                        <Button variant="outline" onClick={toggleDeleteConfirmation}>Cancel</Button>
                                        <Button variant="destructive" onClick={handleDeleteALaCardMenu}>Confirm</Button>
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
