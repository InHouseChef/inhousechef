import { Header } from '@/components'
import { Button } from '@/packages/components'
import { MealList } from './components/MealList/MealList'

export default function Meals() {
    return (
        <>
            <Header heading='Meals'>
                <Button>Create Meal</Button>
            </Header>
            <MealList />
        </>
    )
}
