import clsx from 'clsx'

interface MealTypeSelectorProps {
    selectedMealType: 'MainCourse' | 'SideDish'
    onMealTypeChange: (mealType: 'MainCourse' | 'SideDish') => void
}

const MealTypeSelector = ({ selectedMealType, onMealTypeChange }: MealTypeSelectorProps) => {
    return (
        <nav className='mt-4 rounded-full border bg-white'>
            <ul className='flex h-full items-center px-1.5 py-1'>
                <li
                    className={clsx('flex-1 cursor-pointer rounded-full py-3.5 text-center drop-shadow-2xl', {
                        'bg-primary text-white': selectedMealType === 'MainCourse',
                        'text-black': selectedMealType !== 'MainCourse'
                    })}
                    onClick={() => onMealTypeChange('MainCourse')}>
                    Glavna jela
                </li>
                <li
                    className={clsx('flex-1 cursor-pointer rounded-full py-3.5 text-center drop-shadow-2xl', {
                        'bg-primary text-white': selectedMealType === 'SideDish',
                        'text-black': selectedMealType !== 'SideDish'
                    })}
                    onClick={() => onMealTypeChange('SideDish')}>
                    Prilozi
                </li>
            </ul>
        </nav>
    )
}

export default MealTypeSelector
