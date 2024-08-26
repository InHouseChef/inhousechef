import { DailyMenuMeal } from '@/api/daily-menus'
import clsx from 'clsx'

interface MealCardProps extends DailyMenuMeal {
    onClick: () => void
}

export const MealCard = ({ name, description, price, imageUrl, onClick }: MealCardProps) => {
    return (
        <div onClick={onClick} className={clsx('col-span-full cursor-pointer rounded-xl shadow-md')}>
            <div className='flex items-center'>
                <div className='mr-4 h-32 w-32 flex-shrink-0 rounded-lg bg-gray-200'>
                    {imageUrl ? (
                        <img src={imageUrl} alt={name} className='h-32 w-32 rounded-lg object-cover' />
                    ) : (
                        <div className='flex h-32 w-32 flex-col items-center justify-center rounded-lg text-gray-600'>
                            No Image
                        </div>
                    )}
                </div>
                <div className='flex flex-col gap-0'>
                    <h4 className={clsx('text-lg font-semibold')}>{name}</h4>
                    <div className='flex flex-col gap-5'>
                        <p className={clsx('text-sm text-gray-600')}>{description}</p>
                        <p className={clsx('text-blue-500')}>RSD {price.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
