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
    const hasALaCardPermission = useCartStore(state => state.hasALaCardPermission);

    return (
        <nav className="topnav-horizontal mx-2 h-14 min-h-14 rounded-md bg-gray-100 mt-4">
            <ul className="flex h-full items-center gap-2">
                {hasALaCardPermission && isTodaySelected && aLaCarteShift && (
                    <li
                        className={clsx('flex-1 cursor-pointer rounded-lg py-2 h-full flex items-center justify-center text-sm text-center', {
                            'bg-primary text-white': selectedShiftId === aLaCarteShift.id,
                            'text-black': selectedShiftId !== aLaCarteShift.id,
                        })}
                        onClick={() => onShiftChange(aLaCarteShift.id)}
                    >
                        Za sada
                    </li>
                )}
                {shifts.map(shift => (
                    <li
                        key={shift.id}
                        className={clsx('flex-1 cursor-pointer rounded-lg py-2 text-sm text-center', {
                            'bg-primary text-white': selectedShiftId === shift.id,
                            'text-black': selectedShiftId !== shift.id,
                        })}
                        onClick={() => onShiftChange(shift.id)}
                    >
                        {`${formatTimeWithoutSeconds(shift.shiftStartAt)} - ${formatTimeWithoutSeconds(shift.shiftEndAt)}`}
                    </li>
                ))}
            </ul>
        </nav>
    );
};
