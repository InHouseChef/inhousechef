import { DailyMenuMeal } from '@/api/daily-menus'
import clsx from 'clsx'

interface MealCardProps extends DailyMenuMeal {
    quantity?: number
    onClick: () => void
    small?: boolean
}

export const MealCard = ({ id, name, description, price, imageUrl, onClick, small, quantity }: MealCardProps) => {
    return (
        <div onClick={onClick} className={clsx('relative col-span-full cursor-pointer rounded-xl bg-white shadow-md')}>
            <div className='flex h-full items-center'>
                <div
                    className={clsx('relative mr-4 flex-shrink-0 rounded-lg bg-gray-200', {
                        'h-20 w-20': small,
                        'h-36 w-36': !small
                    })}>
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={name}
                            className={clsx('rounded-lg object-cover', { 'h-20 w-20': small, 'h-36 w-36': !small })}
                        />
                    ) : (
                        <div
                            className={clsx('flex flex-col items-center justify-center rounded-lg text-gray-600', {
                                'h-20 w-20': small,
                                'h-36 w-36': !small
                            })}>
                            Nema slike
                        </div>
                    )}
                    {quantity && quantity > 0 ? (
                        <div className='absolute left-0 top-0 flex h-10 w-12 items-center justify-center rounded-br-lg rounded-tl-lg bg-primary text-lg text-white'>
                            {quantity}
                        </div>
                    ) : undefined}
                </div>
                <div className={clsx('flex h-full flex-1 flex-col justify-between px-2 py-2')}>
                    <div className='flex flex-col'>
                        <h4 className={clsx('text-lg font-semibold')}>{name}</h4>
                        <p className={clsx('text-sm text-gray-600')}>
                            {description && description.length > 50
                                ? description.substring(0, 50).concat('...')
                                : description}
                        </p>
                    </div>
                    <p className={clsx('bottom-0 text-blue-500')}>{price.toFixed(2)} RSD</p>
                </div>
            </div>
        </div>
    )
}
