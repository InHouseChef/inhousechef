'use client'

import { Header } from '@/components'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { MealList } from './components/MealList/MealList'

export default function Meals() {
    const router = useRouter()

    return (
        <>
            <Header heading='Meals'>
                <Button type='button' onClick={() => router.push('/meals/create')}>
                    Create Meal
                </Button>
            </Header>
            <MealList />
        </>
    )
}
