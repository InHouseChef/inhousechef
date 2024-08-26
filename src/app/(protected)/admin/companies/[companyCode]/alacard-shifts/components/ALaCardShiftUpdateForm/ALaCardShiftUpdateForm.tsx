'use client'

import { Header, Loader } from '@/components'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { TimePicker } from '@/components/ui/time-picker'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createALaCardShift, readALaCardShift, useReadALaCardShift } from '@/api/alacard-shifts'
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
    });
}

export const ALaCardShiftUpdateForm = ({ companyCode }: ALaCardShiftUpdateFormProps) => {
    const { data: shift, isLoading } = useReadALaCardShift({ path: { companyCode } })
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

///////// ALACARD CACHING PROBLEM

    const form = useForm<ALaCardShiftUpdateFormData>({
        resolver: zodResolver(createALaCardShiftSchema),
        defaultValues: {
            shiftStartAt: '',
            shiftEndAt: ''
        }
    })

    const { control, reset, handleSubmit } = form

    useEffect(() => {
        if (shift) {
            reset({
                shiftStartAt: shift.shiftStartAt,
                shiftEndAt: shift.shiftEndAt,
            });
            setStartDate(new Date(shift.shiftStartAt));
            setEndDate(new Date(shift.shiftEndAt));
        }
    }, [shift, reset])

    const onSubmit = (formData: ALaCardShiftUpdateFormData) => {
        const formattedStartTime = getFormattedTime(startDate)
        const formattedEndTime = getFormattedTime(endDate)

        createALaCardShift({ path: {companyCode}, body: {
            shiftStartAt: formattedStartTime,
            shiftEndAt: formattedEndTime
        }}).then((updateResult) => {
            reset({
                shiftStartAt: updateResult.shiftStartAt,
                shiftEndAt: updateResult.shiftEndAt,
            })
        })
    }

    if (isLoading) {
        return <Loader />
    }

    return (
        <Form {...form} >
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
