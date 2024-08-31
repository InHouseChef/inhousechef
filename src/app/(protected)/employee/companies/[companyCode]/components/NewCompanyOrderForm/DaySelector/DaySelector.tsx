import React from 'react';
import clsx from 'clsx';

const DaySelectorNav = ({ selectedDay, onDayChange }) => (
    <nav className="topnav-horizontal mx-2 h-14 min-h-14 rounded-md bg-gray-100">
        <ul className="flex h-full items-center">
            <li
                className={clsx('ml-2 flex-1 cursor-pointer rounded-lg py-2 text-center', {
                    'bg-primary text-white': selectedDay === 'today',
                    'text-black': selectedDay !== 'today'
                })}
                onClick={() => onDayChange('today')}
            >
                Za danas
            </li>
            <li
                className={clsx('mr-2 flex-1 cursor-pointer rounded-lg py-2 text-center', {
                    'bg-primary text-white': selectedDay === 'tomorrow',
                    'text-black': selectedDay !== 'tomorrow'
                })}
                onClick={() => onDayChange('tomorrow')}
            >
                Za sutra
            </li>
        </ul>
    </nav>
);

export default DaySelectorNav;
