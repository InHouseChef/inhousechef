import { DailyMenuMeal } from '@/api/daily-menus'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import Image from 'next/image'

interface MealCardProps extends DailyMenuMeal {
    isOrdered: boolean
    onOrder: () => void
}

export const MealCard = ({ name, description, price, imageUrl, isOrdered, onOrder }: MealCardProps) => {
    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-md flex items-center justify-between">
            <div className="flex items-center">
                <div className="w-24 h-20 flex-shrink-0 bg-gray-200 rounded-lg mr-4">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={name}
                            className="w-24 h-20 object-cover rounded-lg"
                        />
                    ) : (
                        <div className="w-24 h-20 bg-gray-200 rounded-lg"></div>
                    )}
                </div>
                <div className="flex-grow">
                    <h4 className="text-sm font-semibold">{name}</h4>
                    {/* <p className="text-xs text-gray-600 text-ellipsis"><b>Description:</b> {description}</p> */}
                    <p className="text-xs text-gray-600"><b>Price:</b> {price.toFixed(2)} RSD</p>
                </div>
            </div>
            <div className="ml-4 flex-shrink-0">
                <Button 
                    className={clsx('rounded-full', {
                        'bg-emerald-600 text-white': isOrdered,
                        'bg-primary text-white': !isOrdered
                    })}
                    onClick={onOrder}
                >
                    {isOrdered ? 'Poručeno' : 'Poruči'}
                </Button>
            </div>
        </div>
    )
}

export default MealCard
