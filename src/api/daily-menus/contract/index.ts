import { MealType } from '@/api/meals'
import { DateTimeLocalIso } from '@/types'

export interface DailyMenuMeal {
    id: string
    name: string
    description: string
    price: number
    type: MealType
    imageUrl: string
}

interface DailyMenu {
    date: DateTimeLocalIso
    meals: DailyMenuMeal[]
}

export interface ReadDailyMenuResponse extends DailyMenu {
    id: string
}
export interface AddMealsToDailyMenusRequest {
    dates: DateTimeLocalIso[]
    mealIds: string[]
}
export interface AddMealsToDailyMenusResponse {
    // newDailyMenus: DailyMenu[]
}
export interface UpdateDailyMenuRequest extends DailyMenu {}
export interface UpdateDailyMenuResponse extends DailyMenu {
    id: string
}
