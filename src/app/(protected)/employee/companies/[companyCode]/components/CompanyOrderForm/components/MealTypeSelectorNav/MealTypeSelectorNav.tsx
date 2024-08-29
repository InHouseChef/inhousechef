import { MealType } from '@/api/meals'
import clsx from 'clsx'
import { useCartStore } from '../../../../state'
import { getMealTypeLabel } from '../../../../utils'

const MealTypeSelectorNav = () => {
    const { selectedMealType, setSelectedMealType } = useCartStore()
    const mealTypes: MealType[] = ['MainCourse', 'SideDish']

    return (
        <nav className='mx-2 rounded-md bg-white'>
            <ul className='flex h-full items-center'>
                {mealTypes.map(type => (
                    <li
                        key={type}
                        className={clsx('flex-1 cursor-pointer rounded-lg py-1 text-center', {
                            'bg-blue-500 text-white': selectedMealType === type,
                            'text-black': selectedMealType !== type
                        })}
                        onClick={() => setSelectedMealType(type)}>
                        {getMealTypeLabel(type)}
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default MealTypeSelectorNav
