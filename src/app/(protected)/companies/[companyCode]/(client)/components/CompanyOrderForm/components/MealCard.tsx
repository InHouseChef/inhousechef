import { DailyMenuMeal } from '@/api/daily-menus'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import Image from 'next/image'

interface MealCardProps extends DailyMenuMeal {
    isOrdered: boolean
}

export const MealCard = ({ name, description, price, imageUrl, isOrdered }: MealCardProps) => {
    return (
        <div className='flex items-center justify-between gap-4 rounded-lg bg-white shadow'>
            <Image src={imageUrl || ''} alt={name} className='h-16 w-16 rounded-lg object-cover' />
            <div className='flex flex-col justify-end gap-1'>
                <div>
                    <h3 className='font-semibold'>{name}</h3>
                    <p className='text-sm text-gray-600'>{description}</p>
                    <p className='pt-2 text-lg font-bold'>{price} RSD</p>
                </div>
                <Button
                    className={clsx('rounded-full', {
                        'bg-secondary text-white': isOrdered,
                        'bg-primary text-white': !isOrdered
                    })}
                    onClick={() => {}}>
                    {isOrdered ? 'Poručeno' : 'Poruči'}
                </Button>
            </div>
        </div>
    )
}

export default MealCard
