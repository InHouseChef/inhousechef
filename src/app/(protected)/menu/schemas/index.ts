import { array, object, string } from 'zod'

export const createDailyMenusSchema = object({
    dates: array(string()).min(1, 'Dates are required'),
    mealIds: array(string()).min(1, 'Meals are required')
})
