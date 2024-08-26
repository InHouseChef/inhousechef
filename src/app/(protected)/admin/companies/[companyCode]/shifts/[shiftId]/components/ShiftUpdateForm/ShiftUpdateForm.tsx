'use client'

import { Header, Loader } from '@/components'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useReadShift } from '@/api/shifts/repository/hooks/readShift'
import { updateShiftSchema } from '../../../schemas'
import { TimePicker } from '@/components/ui/time-picker'
import { useState } from 'react'

type ShiftUpdateFormData = z.infer<typeof updateShiftSchema>

interface ShiftUpdateFormProps {
    companyCode: string
    shiftId: string
}

const getFormattedTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

export const ShiftUpdateForm = ({ companyCode, shiftId }: ShiftUpdateFormProps) => {
    const { data: shift, isLoading } = useReadShift({ path: { companyCode, shiftId } })
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    const form = useForm<ShiftUpdateFormData>({
        resolver: zodResolver(updateShiftSchema),
        defaultValues: {
            name: '',
            shiftStartAt: '',
            shiftEndAt: '',
            orderingDeadlineBeforeShiftStart: 0
        }
    })

    const { control, reset, handleSubmit } = form

    useEffect(() => {
        if (shift) {
            reset({
                name: shift.name || '',
                shiftStartAt: shift.shiftStartAt,
                shiftEndAt: shift.shiftEndAt,
                orderingDeadlineBeforeShiftStart: shift.orderingDeadlineBeforeShiftStart || 0,
            });
            // setStartDate(new Date(shift.shiftStartAt));
            // setEndDate(new Date(shift.shiftEndAt));
        }
    }, [shift, reset])

    // const onSubmit = async (formData: ShiftUpdateFormData) => {
    //     const updateResult = await updateShift({
    //         path: { shiftId },
    //         body: formData,
    //     })

    //     reset({
    //         name: updateResult.name,
    //         shiftStartAt: new Date(updateResult.shiftStartAt),
    //         shiftEndAt: new Date(updateResult.shiftEndAt),
    //         orderingDeadlineBeforeShiftStart: updateResult.orderingDeadlineBeforeShiftStart,
    //     })
    // }

    if (isLoading) {
        return <Loader />
    }

    return (
        <Form {...form}>
            <form className='h-full'>
                <Header heading='Shift' />
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
                                                <TimePicker disabled setDate={setStartDate} date={startDate} />
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
                                                <TimePicker disabled setDate={setEndDate} date={endDate} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-6'>
                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder='Shift Name' required disabled />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='col-span-6'>
                                <FormField
                                    control={control}
                                    name="orderingDeadlineBeforeShiftStart"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ordering Deadline Before Shift Start (in hours)</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="number" value={field.value || 0} required disabled />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className='mt-8 flex items-center justify-end'>
                    <Button type='submit'>Save</Button>
                </div> */}
            </form>
        </Form>
    )
}
