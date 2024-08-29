import { DailyMenuMeal, ReadDailyMenuResponse } from "@/api/daily-menus";
import { MealTypeEnum } from "@/api/meals";
import { MealCard } from "@/app/(protected)/employee/companies/[companyCode]/components/CompanyOrderForm/components/MealCard/MealCard";
import { formatDateSerbianLatin } from "@/utils/date";

export const MenuPage = ({ dailyMenus }: { dailyMenus: ReadDailyMenuResponse[] }) => (
    <div className='mt-4'>
        {dailyMenus.map((dailyMenu: ReadDailyMenuResponse) => (
            <div key={dailyMenu.date} className="mb-6">
                <h2 className="text-xl font-semibold">{formatDateSerbianLatin(new Date(dailyMenu.date))}</h2>
                <div className="grid grid-cols-1 gap-6 mt-4">
                    {dailyMenu.meals.filter(meal => meal.type === MealTypeEnum.MainCourse).map((meal: DailyMenuMeal) => (
                        <MealCard key={meal.id} id={meal.id} name={meal.name} price={meal.price} imageUrl={meal.imageUrl} small={true} />
                    ))}
                </div>
            </div>
        ))}
    </div>
)