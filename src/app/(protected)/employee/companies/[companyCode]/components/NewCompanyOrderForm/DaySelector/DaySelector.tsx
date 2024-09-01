import React from 'react';
import clsx from 'clsx';
import { useCartStore } from '@/app/(protected)/employee/newstate';
import { getToLocalISOString } from '@/utils/date';

const DaySelector: React.FC = () => {
    const { activeDay, setActiveDay, hasALaCardPermission } = useCartStore();

    if (!hasALaCardPermission) {
        // If the user doesn't have A La Carte permission, only allow selecting "tomorrow"
        const tomorrowDate = getToLocalISOString(new Date(Date.now() + 86400000)).split('T')[0];
        if (activeDay !== tomorrowDate) {
            setActiveDay(tomorrowDate);
        }
        return null;
    }

    const handleDayChange = (day: 'today' | 'tomorrow') => {
        const selectedDate = day === 'today' ? getToLocalISOString(new Date()).split('T')[0] : getToLocalISOString(new Date(Date.now() + 86400000)).split('T')[0];
        setActiveDay(selectedDate);
    };

    return (
        <nav className="topnav-horizontal h-14 min-h-14 rounded-md bg-gray-100">
            <ul className="flex h-full items-center">
                <li
                    className={clsx('ml-2 flex-1 cursor-pointer rounded-lg py-2 text-center', {
                        'bg-primary text-white': activeDay === getToLocalISOString(new Date()).split('T')[0],
                        'text-black': activeDay !== getToLocalISOString(new Date()).split('T')[0],
                    })}
                    onClick={() => handleDayChange('today')}
                >
                    Za danas
                </li>
                <li
                    className={clsx('mr-2 flex-1 cursor-pointer rounded-lg py-2 text-center', {
                        'bg-primary text-white': activeDay === getToLocalISOString(new Date(Date.now() + 86400000)).split('T')[0],
                        'text-black': activeDay !== getToLocalISOString(new Date(Date.now() + 86400000)).split('T')[0],
                    })}
                    onClick={() => handleDayChange('tomorrow')}
                >
                    Za sutra
                </li>
            </ul>
        </nav>
    );
};

export default DaySelector;
