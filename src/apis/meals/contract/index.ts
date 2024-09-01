interface Meal {
    name: string
    description: string
    purchasePrice: number
    sellingPrice: number
    type: MealTypeEnum
    imageUrl?: string
}

export enum MealTypeEnum {
    MainCourse = 'MainCourse',
    SideDish = 'SideDish'
}

export type MealType = 'MainCourse' | 'SideDish'

export interface ReadMealResponse extends Meal {
    id: string
}

export interface CreateMealRequest extends Meal {}
export interface CreateMealResponse extends Meal {
    id: string
}

export interface UpdateMealDetailsRequest extends Omit<Meal, 'imageUrl'> {}
export interface UpdateMealImageRequest {
    image: File
}
export interface UpdateMealResponse extends Meal {
    id: string
}
