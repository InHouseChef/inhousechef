import { MealType } from '@/api/meals'
import { DateLocalIso } from '@/types'

export interface DailyMenuMeal {
    id: string
    name: string
    description: string
    price: number
    type: MealType
    imageUrl: string
}

interface DailyMenu {
    date: DateLocalIso
    meals: DailyMenuMeal[]
}

export interface ReadDailyMenuResponse extends DailyMenu {
    id: string
}
export interface AddMealsToDailyMenusRequest {
    dates: DateLocalIso[]
    mealIds: string[]
}
export interface AddMealsToDailyMenusResponse {
    // newDailyMenus: DailyMenu[]
}
export interface UpdateDailyMenuRequest extends DailyMenu {}
export interface UpdateDailyMenuResponse extends DailyMenu {
    id: string
}
