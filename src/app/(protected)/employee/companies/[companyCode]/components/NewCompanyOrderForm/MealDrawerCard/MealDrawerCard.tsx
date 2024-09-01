import { DailyMenuMeal } from '@/api/daily-menus'
import { Button } from '@/components/ui/button'

interface MealDrawerCardProps {
    meal?: DailyMenuMeal
    onClick: () => void
}

const MealDrawerCard = ({ meal, onClick }: MealDrawerCardProps) => (
    <div
        className='w-60 flex-shrink-0 overflow-hidden rounded-lg border bg-white p-4 shadow-md'
        key={meal?.id}
        onClick={onClick}>
        <img src={meal?.imageUrl} alt={meal?.name} className='h-32 w-full object-cover' />
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-0'>
                <h3 className='text-lg font-semibold'>{meal?.name}</h3>
                <p className='text-blue-500'>{meal?.price.toFixed(2)} RSD</p>
            </div>
            <Button onClick={onClick} className='self-start'>
                Izaberi
            </Button>
        </div>
    </div>
)

export default MealDrawerCard
