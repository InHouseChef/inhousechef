'use client'

import { usePathParams } from '@/hooks'
import { MealUpdateForm } from './components/MealUpdateForm/MealUpdateForm'

export default function MealPage() {
    const { mealId } = usePathParams<{ mealId: string }>()

    return <MealUpdateForm mealId={mealId} />
}
