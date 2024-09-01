import clsx from 'clsx'

interface MealTypeSelectorProps {
    selectedMealType: 'MainCourse' | 'SideDish'
    onMealTypeChange: (mealType: 'MainCourse' | 'SideDish') => void
}

const MealTypeSelector = ({ selectedMealType, onMealTypeChange }: MealTypeSelectorProps) => {
    return (
        <nav className='mt-4 rounded-md bg-white'>
            <ul className='flex h-full items-center'>
                <li
                    className={clsx('flex-1 cursor-pointer rounded-lg py-2 text-center', {
                        'bg-primary text-white': selectedMealType === 'MainCourse',
                        'text-black': selectedMealType !== 'MainCourse'
                    })}
                    onClick={() => onMealTypeChange('MainCourse')}>
                    Glavna jela
                </li>
                <li
                    className={clsx('flex-1 cursor-pointer rounded-lg py-2 text-center', {
                        'bg-primary text-white': selectedMealType === 'SideDish',
                        'text-black': selectedMealType !== 'SideDish'
                    })}
                    onClick={() => onMealTypeChange('SideDish')}>
                    Dodaci
                </li>
            </ul>
        </nav>
    )
}

export default MealTypeSelector
