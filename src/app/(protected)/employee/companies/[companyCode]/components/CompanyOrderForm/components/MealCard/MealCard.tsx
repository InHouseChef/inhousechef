import { DailyMenuMeal } from '@/api/daily-menus'
import clsx from 'clsx'

interface MealCardProps extends DailyMenuMeal {
    onClick: () => void
    small: boolean
}

export const MealCard = ({ name, description, price, imageUrl, onClick, small }: MealCardProps) => {
    return (
        <div onClick={onClick} className={clsx('col-span-full cursor-pointer rounded-xl shadow-md bg-white')}>
            <div className='flex items-center h-full'>
                <div className={clsx('mr-4 flex-shrink-0 rounded-lg bg-gray-200', { 'h-20 w-20' : small, 'h-36 w-36' : !small })}>
                    {imageUrl ? (
                        <img src={imageUrl} alt={name} className={clsx('rounded-lg object-cover', { 'h-20 w-20' : small, 'h-36 w-36' : !small })}/>
                    ) : (
                        <div className={clsx('flex flex-col items-center justify-center rounded-lg text-gray-600', { 'h-20 w-20' : small, 'h-36 w-36' : !small })}>
                            No Image
                        </div>
                    )}
                </div>
                <div className={clsx('flex flex-col flex-1 h-full justify-between px-2 py-2')}>
                    <div className='flex flex-col'>
                        <h4 className={clsx('text-lg font-semibold')}>{name}</h4>
                        <p className={clsx('text-sm text-gray-600')}>{description && description.length > 50 ? description.substring(0, 50).concat('...') : description}</p>
                    </div>
                    <p className={clsx('text-blue-500 bottom-0')}>{price.toFixed(2)} RSD</p>
                </div>
            </div>
        </div>
    )
}
