import React from 'react';
import clsx from 'clsx';

const MealTypeSelectorNav = ({ selectedMealType, onMealTypeChange }) => {
    return (
        <nav className="mx-2 rounded-md bg-white mt-4">
            <ul className="flex h-full items-center">
                <li
                    className={clsx('flex-1 cursor-pointer rounded-lg py-2 text-center', {
                        'bg-primary text-white': selectedMealType === 'MainCourse',
                        'text-black': selectedMealType !== 'MainCourse'
                    })}
                    onClick={() => onMealTypeChange('MainCourse')}
                >
                    Glavna jela
                </li>
                <li
                    className={clsx('flex-1 cursor-pointer rounded-lg py-2 text-center', {
                        'bg-primary text-white': selectedMealType === 'SideDish',
                        'text-black': selectedMealType !== 'SideDish'
                    })}
                    onClick={() => onMealTypeChange('SideDish')}
                >
                    Dodaci
                </li>
            </ul>
        </nav>
    );
};

export default MealTypeSelectorNav;
