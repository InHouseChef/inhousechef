import { DailyMenuMeal } from '@/api/daily-menus'
import clsx from 'clsx'
import { useCartStore } from '../../../../state'

interface MealCardProps extends DailyMenuMeal {
    onClick: () => void
    selectedDate: string
    selectedShiftId: string
}

export const MealCard = ({
    name,
    description,
    price,
    imageUrl,
    onClick,
    selectedDate,
    selectedShiftId,
    id
}: MealCardProps) => {
    const { carts } = useCartStore()

    const isInCart = !!carts[selectedShiftId]?.[selectedDate]?.find(item => item.id === id)

    return (
        <div
            onClick={onClick}
            className={`col-span-full cursor-pointer rounded-xl bg-white px-4 py-6 shadow-md ${clsx(isInCart && 'bg-primary')}`}>
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
                    <h4 className={`text-lg font-semibold ${clsx(isInCart && 'text-white')}`}>{name}</h4>
                    <div className='flex flex-col gap-5'>
                        <p className={`text-sm text-gray-600 ${clsx(isInCart && 'text-white')}`}>{description}</p>
                        <p className={`text-blue-500 ${clsx(isInCart && 'text-white')}`}>RSD {price.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
