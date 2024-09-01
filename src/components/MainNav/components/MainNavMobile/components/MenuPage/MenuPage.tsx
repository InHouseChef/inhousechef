import { DailyMenuMeal, ReadDailyMenuResponse } from '@/api/daily-menus'
import { MealTypeEnum } from '@/api/meals'
import { MealCard } from '@/app/(protected)/employee/companies/[companyCode]/components/MealCard/MealCard';
import { formatDateSerbianLatin } from '@/utils/date'

export const MenuPage = ({ dailyMenus, days }: { dailyMenus: ReadDailyMenuResponse[]; days: number }) => {
    // Get the latest date from the dailyMenus array
    const latestDate = dailyMenus.length > 0 ? new Date(dailyMenus[dailyMenus.length - 1].date) : new Date()

    // Helper function to calculate the date for the next day
    const calculateDate = (date: Date, daysToAdd: number) => {
        const nextDate = new Date(date)
        nextDate.setDate(nextDate.getDate() + daysToAdd)
        return nextDate
    }

    return (
        <div className='mt-4'>
            {Array.from({ length: days }).map((_, index) => {
                const dailyMenu = dailyMenus[index]
                const displayDate = dailyMenu
                    ? new Date(dailyMenu.date)
                    : calculateDate(latestDate, index - dailyMenus.length + 1)

                if (dailyMenu) {
                    const meals = dailyMenu.meals.filter(meal => meal.type === MealTypeEnum.MainCourse)
                    return (
                        <div key={dailyMenu.date} className='mb-6'>
                            <h2 className='text-xl font-semibold'>{formatDateSerbianLatin(displayDate)}</h2>
                            <div className='mt-4 grid grid-cols-1 gap-6'>
                                {meals.length > 0 ? (
                                    meals.map((meal: DailyMenuMeal) => (
                                        <MealCard
                                            key={meal.id}
                                            id={meal.id}
                                            name={meal.name}
                                            price={meal.price}
                                            imageUrl={meal.imageUrl}
                                            small={true}
                                        />
                                    ))
                                ) : (
                                    <div className='mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-gray-500'>
                                        Nema dostupnih jela za ovaj dan.
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div key={index} className='mb-6'>
                            <h2 className='text-xl font-semibold'>{formatDateSerbianLatin(displayDate)}</h2>
                            <div className='mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-gray-500'>
                                Dnevni meni za ovaj dan nije postavljen.
                            </div>
                        </div>
                    )
                }
            })}
        </div>
    )
}
