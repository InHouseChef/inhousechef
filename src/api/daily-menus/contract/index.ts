import { DateIso } from '@/types'

interface DailyMenuMeal {
    name: string
    description: string
    price: number
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
    mealsIds: string[]
}
export interface AddMealsToDailyMenusResponse {
    // newDailyMenus: DailyMenu[]
}
export interface UpdateDailyMenuRequest extends DailyMenu {}
export interface UpdateDailyMenuResponse extends DailyMenu {
    id: string
}
