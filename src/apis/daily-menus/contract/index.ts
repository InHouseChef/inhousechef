import { MealType } from '@/apis/meals'
import { DateIso } from '@/types'

export interface DailyMenuMeal {
    id: string
    name: string
    description: string
    price: number
    type: MealType
    imageUrl: string
}

interface DailyMenu {
    date: DateIso
    meals: DailyMenuMeal[]
}

export interface ReadDailyMenuResponse extends DailyMenu {
    id: string
}
export interface AddMealsToDailyMenusRequest {
    dates: DateIso[]
    mealIds: string[]
}
export interface AddMealsToDailyMenusResponse {
    newDailyMenus: DailyMenu[]
}
export interface UpdateDailyMenuRequest extends DailyMenu {}
export interface UpdateDailyMenuResponse extends DailyMenu {
    id: string
}
