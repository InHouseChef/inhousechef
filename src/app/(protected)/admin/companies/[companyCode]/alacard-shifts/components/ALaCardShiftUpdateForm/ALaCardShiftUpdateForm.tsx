'use client'

import { createALaCardShift, useReadALaCardShift } from '@/api/alacard-shifts'
import { Header, Loader } from '@/components'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { TimePicker } from '@/components/ui/time-picker'
import { Time } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createALaCardShiftSchema } from '../../schemas'

type ALaCardShiftUpdateFormData = z.infer<typeof createALaCardShiftSchema>

interface ALaCardShiftUpdateFormProps {
    companyCode: string
}

const getFormattedTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    })
}

const convertTimeToDate = (timeString: Time) => {
    // Get the current date
    const currentDate = new Date()

    // Split the time string into hours, minutes, and seconds
    const [hours, minutes, seconds] = timeString.split(':').map(Number)

    // Set the hours, minutes, and seconds on the current date
    currentDate.setHours(hours)
    currentDate.setMinutes(minutes)
    currentDate.setSeconds(seconds)
    currentDate.setMilliseconds(0) // Set milliseconds to 0 for precision

    return currentDate
}

export const ALaCardShiftUpdateForm = ({ companyCode }: ALaCardShiftUpdateFormProps) => {
    const { data: shift, isLoading, refetch: refetchALaCardShift } = useReadALaCardShift({ path: { companyCode } })
    const [startDate, setStartDate] = useState<Date>(new Date(new Date().setHours(0, 0, 0, 0)))
    const [endDate, setEndDate] = useState<Date>(new Date(new Date().setHours(0, 0, 0, 0)))

    const form = useForm<ALaCardShiftUpdateFormData>({
        resolver: zodResolver(createALaCardShiftSchema),
        defaultValues: {
            shiftStartAt: new Date(),
            shiftEndAt: new Date()
        }
    })

    const { control, reset, handleSubmit } = form

    useEffect(() => {
        if (shift) {
            const formattedStartDate = convertTimeToDate(shift.shiftStartAt)
            const formattedEndDate = convertTimeToDate(shift.shiftEndAt)

            setStartDate(formattedStartDate)
            setEndDate(formattedEndDate)
        }
    }, [shift, reset])

    const onSubmit = (formData: ALaCardShiftUpdateFormData) => {
        const formattedStartTime = getFormattedTime(startDate)
        const formattedEndTime = getFormattedTime(endDate)

        createALaCardShift({
            path: { companyCode },
            body: {
                shiftStartAt: formattedStartTime,
                shiftEndAt: formattedEndTime
            }
        }).then(_ => {
            refetchALaCardShift()
        })
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <Form {...form}>
            <form className='h-full' onSubmit={handleSubmit(onSubmit)}>
                <Header heading='A La Card Shift' />
                <div className='grid grid-cols-12'>
                    <div className='col-span-12'>
                        <div className='grid grid-cols-12 gap-3'>
                            <div className='col-span-6'>
                                <FormField
                                    control={control}
                                    name='shiftStartAt'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Shift Start Time</FormLabel>
                                            <FormControl>
                                                {/* @ts-ignore */}
                                                <TimePicker setDate={setStartDate} date={startDate} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-6'>
                                <FormField
                                    control={control}
                                    name='shiftEndAt'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Shift End Time</FormLabel>
                                            <FormControl>
                                                {/* @ts-ignore */}
                                                <TimePicker setDate={setEndDate} date={endDate} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mt-8 flex items-center justify-end'>
                    <Button type='submit'>Save</Button>
                </div>
            </form>
        </Form>
    )
}
