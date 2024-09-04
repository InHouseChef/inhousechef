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

export const ShiftSelector: React.FC<ShiftSelectorProps> = ({
    selectedShiftId,
    onShiftChange,
    shifts,
    aLaCarteShift,
    isTodaySelected,
}) => {
    const { hasALaCardPermission, activeDay } = useCartStore((state) => ({
        hasALaCardPermission: state.hasALaCardPermission,
        activeDay: state.activeDay,
    }));

    const sortedShifts = shifts.slice().sort(
        (a, b) =>
            new Date(`1970-01-01T${a.shiftStartAt}`).getTime() -
            new Date(`1970-01-01T${b.shiftStartAt}`).getTime()
    );

    const currentDate = new Date();
    const activeDayDate = new Date(activeDay);

    const isSameDay = (date1: Date, date2: Date) =>
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();

    const isToday = isSameDay(currentDate, activeDayDate);

    const isALaCarteShiftActive = () => {
        if (!aLaCarteShift || !isToday) return false;

        const shiftStartTime = new Date(`${activeDay}T${aLaCarteShift.shiftStartAt}`);
        const shiftEndTime = new Date(`${activeDay}T${aLaCarteShift.shiftEndAt}`);

        return currentDate >= shiftStartTime && currentDate <= shiftEndTime;
    };

    const allShiftsPassed = sortedShifts.every((shift) => {
        const shiftStartTime = new Date(`${activeDay}T${shift.shiftStartAt}`);
        const orderDeadlineTime = new Date(
            shiftStartTime.getTime() - shift.orderingDeadlineBeforeShiftStart * 60 * 60 * 1000
        );

        if (isToday) {
            // Validate today's shifts
            return currentDate > orderDeadlineTime && !isALaCarteShiftActive();
        } else {
            // Validate tomorrow's shifts
            const adjustedDeadlineTime = new Date(orderDeadlineTime);
            // If the shift deadline is today, compare with today's date
            if (adjustedDeadlineTime < currentDate) {
                return false; // Disable the shift for tomorrow
            }
            return false;
        }
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
                                    'bg-primary text-white drop-shadow-primary': selectedShiftId === aLaCarteShift.id && isALaCarteShiftActive(),
                                    'text-black': selectedShiftId !== aLaCarteShift.id && isALaCarteShiftActive(),
                                    'text-gray-400 cursor-not-allowed bg-gray-100': !isALaCarteShiftActive(), // Disable if not active
                                }
                            )}
                            onClick={(e) => {
                                if (isALaCarteShiftActive()) {
                                    onShiftChange(aLaCarteShift.id);
                                }
                                else {
                                    e.preventDefault();
                                }
                            }}
                        >
                            Za sada
                        </li>
                    )}
                    {sortedShifts.map((shift) => {
                        const shiftStartTime = new Date(`${activeDay}T${shift.shiftStartAt}`);
                        const orderDeadlineTime = new Date(
                            shiftStartTime.getTime() - shift.orderingDeadlineBeforeShiftStart * 60 * 60 * 1000
                        );

                        let isShiftDisabled;
                        if (isToday) {
                            // Today's shift validation
                            isShiftDisabled = currentDate > orderDeadlineTime;
                        } else {
                            // Tomorrow's shift validation
                            const adjustedDeadlineTime = new Date(orderDeadlineTime);
                            // If the shift deadline is today, disable the shift for tomorrow
                            isShiftDisabled = adjustedDeadlineTime < currentDate;
                        }

                        return (
                            <li
                                key={shift.id}
                                className={clsx(
                                    'flex-1 cursor-pointer rounded-lg p-2 h-full text-xs flex flex-col items-center justify-center text-center',
                                    {
                                        'bg-primary text-white drop-shadow-primary': selectedShiftId === shift.id && !isShiftDisabled,
                                        'text-black': selectedShiftId !== shift.id && !isShiftDisabled,
                                        'text-gray-400 cursor-not-allowed bg-gray-100': isShiftDisabled, // Apply disabled styles
                                    },
                                    {
                                        'border-l-2 border-primary': selectedShiftId === shift.id && !isShiftDisabled,
                                    }
                                )}
                                onClick={(e) => {
                                    if (!isShiftDisabled) {
                                        onShiftChange(shift.id);
                                    }
                                    else {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <div>{`${formatTimeWithoutSeconds(shift.shiftStartAt)}`}</div>
                                <div>{`${formatTimeWithoutSeconds(shift.shiftEndAt)}`}</div>
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
                        Možete poručiti za sutra.
                    </p>
                </div>
            )}
        </div>
    );
};
