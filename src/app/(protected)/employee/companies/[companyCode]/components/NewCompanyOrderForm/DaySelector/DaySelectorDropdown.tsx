import { useCartStore } from '@/app/(protected)/employee/newstate'
import { getToLocalISOString } from '@/utils/date'
import { ChevronDownIcon } from 'lucide-react' // Assuming you're using lucide-react for icons
import clsx from 'clsx'
import React, { useState } from 'react'

export const DaySelectorDropdown: React.FC = () => {
    const { activeDay, setActiveDay, hasALaCardPermission, setActiveShift } = useCartStore()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const todayDate = getToLocalISOString(new Date()).split('T')[0]
    const tomorrowDate = getToLocalISOString(new Date(Date.now() + 86400000)).split('T')[0]

    const handleDayChange = (day: 'today' | 'tomorrow') => {
        const selectedDate = day === 'today' ? todayDate : tomorrowDate
        setActiveDay(selectedDate)
        setActiveShift(undefined)
        setIsDropdownOpen(false)
    }

    if (!hasALaCardPermission) {
        // If the user doesn't have A La Carte permission, only show the option for tomorrow
        if (activeDay !== tomorrowDate) {
            setActiveDay(tomorrowDate)
        }
        return (
            <div className='flex flex-col items-left justify-left text-primary font-bold'>
                <div>
                    Naručivanje za
                </div>
                <div>
                    <span className='font-normal'>Sutra</span>
                </div>
            </div>
        )
    }

    return (
        <div className='relative'>
            <div
                className='flex flex-col items-left justify-left cursor-pointer text-primary font-bold'
                onClick={() => setIsDropdownOpen(prev => !prev)}
            >
                <span className='mr-1'>Naručivanje za</span>
                <div className='flex flex-row items-left justify-left'>
                    <div className='font-normal'>
                        {activeDay === todayDate ? 'Danas' : 'Sutra'}
                    </div>
                    <ChevronDownIcon className='ml-2 text-black' />
                </div>
            </div>
            {isDropdownOpen && (
                <div className='absolute mt-2 w-32 bg-white shadow-md rounded-lg z-10'>
                    <ul className='py-2'>
                        <li
                            className={clsx(
                                'px-4 py-2 cursor-pointer hover:bg-gray-100',
                                { 'bg-primary text-white': activeDay === todayDate }
                            )}
                            onClick={() => handleDayChange('today')}
                        >
                            Danas
                        </li>
                        <li
                            className={clsx(
                                'px-4 py-2 cursor-pointer hover:bg-gray-100',
                                { 'bg-primary text-white': activeDay === tomorrowDate }
                            )}
                            onClick={() => handleDayChange('tomorrow')}
                        >
                            Sutra
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}
