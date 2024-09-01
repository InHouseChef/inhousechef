import { MealType } from '@/api/meals'
import { DateIso } from '@/types'

export interface ALaCardMenuMeal {
    id: string
    name: string
    description: string
    price: number
    type: MealType
    imageUrl: string
}

interface ALaCardMenu {
    date: DateIso
    meals: ALaCardMenuMeal[]
}

export interface ReadALaCardMenuResponse extends ALaCardMenu {
    id: string
}
export interface AddMealsToALaCardMenusRequest {
    dates: DateIso[]
    mealIds: string[]
}
export interface AddMealsToALaCardMenusResponse {
    // newALaCardMenus: ALaCardMenu[]
}
export interface UpdateALaCardMenuRequest extends ALaCardMenu {}
export interface UpdateALaCardMenuResponse extends ALaCardMenu {
    id: string
}
