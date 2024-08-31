import React from 'react';
import clsx from 'clsx';
import { ALaCarteShift, Shift, useCartStore } from '@/app/(protected)/employee/newstate';
import { formatTimeWithoutSeconds } from '@/utils/date';

interface ShiftSelectorProps {
    selectedShiftId?: string;
    onShiftChange: (shiftId: string) => void;
    shifts: Shift[];
    aLaCarteShift?: ALaCarteShift;
    isTodaySelected: boolean;
}

export const ShiftSelector: React.FC<ShiftSelectorProps> = ({ selectedShiftId, onShiftChange, shifts, aLaCarteShift, isTodaySelected }) => {
    const { hasALaCardPermission, activeDay } = useCartStore(state => ({
        hasALaCardPermission: state.hasALaCardPermission,
        activeDay: state.activeDay,
    }));

    const sortedShifts = shifts.slice().sort(
        (a, b) => new Date(`1970-01-01T${a.shiftStartAt}`) - new Date(`1970-01-01T${b.shiftStartAt}`)
    );

    const currentDate = new Date();
    const activeDayDate = new Date(activeDay);
    const isToday = currentDate.toDateString() === activeDayDate.toDateString();

    const allShiftsPassed = sortedShifts.every(shift => {
        const shiftEndTime = new Date(`${activeDay}T${shift.shiftEndAt}`);
        return isToday && currentDate > shiftEndTime;
    });

    return (
        <div className="relative">
            <nav className="topnav-horizontal h-14 min-h-14 rounded-md bg-gray-100 mt-4">
                <ul className="flex h-full items-center gap-2">
                    {hasALaCardPermission && isTodaySelected && aLaCarteShift && (
                        <li
                            className={clsx(
                                'flex-1 cursor-pointer rounded-lg p-2 h-full flex items-center justify-center text-sm text-center', 
                                {
                                    'bg-primary text-white': selectedShiftId === aLaCarteShift.id,
                                    'text-black': selectedShiftId !== aLaCarteShift.id,
                                }
                            )}
                            onClick={() => onShiftChange(aLaCarteShift.id)}
                        >
                            Za sada
                        </li>
                    )}
                    {sortedShifts.map(shift => {
                        const shiftEndTime = new Date(`${activeDay}T${shift.shiftEndAt}`);
                        const isShiftDisabled = isToday && currentDate > shiftEndTime;

                        return (
                            <li
                                key={shift.id}
                                className={clsx(
                                    'flex-1 cursor-pointer rounded-lg p-2 h-full text-sm flex items-center justify-center text-center',
                                    {
                                        'bg-primary text-white': selectedShiftId === shift.id && !isShiftDisabled,
                                        'text-black': selectedShiftId !== shift.id && !isShiftDisabled,
                                        'text-gray-400 cursor-not-allowed bg-gray-100': isShiftDisabled, // Apply disabled styles
                                    },
                                    {
                                        'border-l-2 border-primary': selectedShiftId === shift.id && !isShiftDisabled,
                                    }
                                )}
                                onClick={() => {
                                    if (!isShiftDisabled) {
                                        onShiftChange(shift.id);
                                    }
                                }}
                            >
                                {`${formatTimeWithoutSeconds(shift.shiftStartAt)} - ${formatTimeWithoutSeconds(shift.shiftEndAt)}`}
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {allShiftsPassed && isTodaySelected && (
                <div className="absolute inset-0 bg-gray-100 rounded-md bg-opacity-90 flex flex-col items-center justify-center z-10">
                    <p className="text-md font-semibold text-gray-700">
                        Porudžbine za današnji dan su zatvorene.
                    </p>
                    <p className="text-sm text-gray-600 text-center">
                        Možete preći na porudžbine za sutrašnji dan.
                    </p>
                </div>
            )}
        </div>
    );
};
