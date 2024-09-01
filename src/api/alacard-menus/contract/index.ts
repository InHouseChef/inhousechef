import { MealType } from '@/api/meals'
import { DateLocalIso } from '@/types'

export interface ALaCardMenuMeal {
    id: string
    name: string
    description: string
    price: number
    type: MealType
    imageUrl: string
}

interface ALaCardMenu {
    date: DateLocalIso
    meals: ALaCardMenuMeal[]
}

export interface ReadALaCardMenuResponse extends ALaCardMenu {
    id: string
}
export interface AddMealsToALaCardMenusRequest {
    dates: DateLocalIso[]
    mealIds: string[]
}
export interface AddMealsToALaCardMenusResponse {
    // newALaCardMenus: ALaCardMenu[]
}
export interface UpdateALaCardMenuRequest extends ALaCardMenu {}
export interface UpdateALaCardMenuResponse extends ALaCardMenu {
    id: string
}
