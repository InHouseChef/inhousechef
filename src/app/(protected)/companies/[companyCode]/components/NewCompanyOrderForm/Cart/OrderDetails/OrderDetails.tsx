import { DateLocalIso, DateTimeIsoUtc, Time } from "@/types";
import { formatEuropeanDate, formatTimeWithoutSeconds, getSerbianLocalDateTime } from "@/utils/date";

export type OrderDetailsProps = {
    number: string,
    orderDate: DateLocalIso,
    orderCreatedAt?: DateTimeIsoUtc,
    shiftStart?: Time,
    shiftEnd?: Time
    placedAt?: DateTimeIsoUtc
    confirmedAt?: DateTimeIsoUtc
}

export const OrderDetails = ({ number, orderDate, orderCreatedAt, shiftStart, shiftEnd, placedAt, confirmedAt }: OrderDetailsProps) => {
    const shiftStartTime = new Date(`${orderDate}T${shiftStart}`);
    const shiftEndTime = new Date(`${orderDate}T${shiftEnd}`);

    const serbianLocale = 'sr-RS';
    const orderDateFormatted = formatEuropeanDate(new Date(orderDate));
    const shiftStartTimeFormatted = formatTimeWithoutSeconds(shiftStartTime.toLocaleTimeString(serbianLocale));
    const shiftEndTimeFormatted = formatTimeWithoutSeconds(shiftEndTime.toLocaleTimeString(serbianLocale));
    const orderCreatedAtFormatted = orderCreatedAt ? getSerbianLocalDateTime(orderCreatedAt) : undefined;
    const placedAtFormatted = placedAt ? getSerbianLocalDateTime(placedAt) : undefined;
    const confirmedAtFormatted = confirmedAt ? getSerbianLocalDateTime(confirmedAt) : undefined;

    return (
        <div className='flex flex-col w-full'>
            <div className='flex flex-row items-center justify-between'>
                <p className='text-center text-sm text-gray-700'>Broj porudžbine</p>
                <p className='text-center text-sm text-gray-700'>#<strong>{number}</strong></p>
            </div>
            <div className='flex flex-row items-center justify-between'>
                <p className='text-center text-sm text-gray-700'>Porudžbina za dan</p>
                <p className='text-center text-sm text-gray-700'><strong>{orderDateFormatted}</strong></p>
            </div>
            {shiftStart && shiftEnd && (
                <div className='flex flex-row items-center justify-between'>
                    <p className='text-center text-sm text-gray-700'>Smena</p>
                    <p className='text-center text-sm text-gray-700'><strong>{shiftStartTimeFormatted}</strong> - <strong>{shiftEndTimeFormatted}</strong></p>
                </div>
            )}
            {orderCreatedAt && (
                <div className='flex flex-row items-center justify-between'>
                    <p className='text-center text-sm text-gray-700'>Napravljeno</p>
                    <p className='text-center text-sm text-gray-700'><strong>{orderCreatedAtFormatted}</strong></p>
                </div>
            )}
            {placedAtFormatted && (
                <div className='flex flex-row items-center justify-between'>
                    <p className='text-center text-sm text-gray-700'>Poručeno</p>
                    <p className='text-center text-sm text-gray-700'><strong>{placedAtFormatted}</strong></p>
                </div>
            )}
            {confirmedAtFormatted && (
                <div className='flex flex-row items-center justify-between'>
                    <p className='text-center text-sm text-gray-700'>Potvrđeno</p>
                    <p className='text-center text-sm text-gray-700'><strong>{confirmedAtFormatted}</strong></p>
                </div>
            )}
        </div>
    )
}