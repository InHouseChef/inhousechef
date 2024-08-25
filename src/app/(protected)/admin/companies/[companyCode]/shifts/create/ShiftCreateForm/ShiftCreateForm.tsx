'use client'

import { useCreateShift } from '@/api/shifts'
import { Header } from '@/components'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createShiftSchema } from '../../schemas'
import { TimePicker } from '@/components/ui/time-picker'
import { useState } from 'react'

type ShiftCreateFormData = z.infer<typeof createShiftSchema>

const getFormattedTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

export const ShiftCreateForm = ({ params }: { params: { companyCode: string } }) => {
    const { companyCode } = params
    const router = useRouter()
    const { mutate: createShift } = useCreateShift()
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();

    const form = useForm<ShiftCreateFormData>({
        resolver: zodResolver(createShiftSchema),
        defaultValues: {
            name: '',
            shiftStartAt: '',
            shiftEndAt: '',
            orderingDeadlineBeforeShiftStart: 0
        }
    })

    const { control, handleSubmit } = form

    const onSubmit = async (formData: ShiftCreateFormData) => {
        const formattedStartDate = getFormattedTime(startDate)
        const formattedEndDate = getFormattedTime(endDate)

        await createShift(
            {
                path: { companyCode },
                body: {
                    ...formData,
                    shiftStartAt: formattedStartDate,
                    shiftEndAt: formattedEndDate,
                }
            },
            {
                onSuccess: data => {
                    router.push(`/admin/companies/${companyCode}/shifts/${data.id}`)
                }
            }
        )
    }
    
    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
                <Header heading='Create Shift' />
                <div className='grid grid-cols-12 gap-4'>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='shiftStartAt'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Shift Start Time (HH:mm)</FormLabel>
                                    <FormControl>
                                        <TimePicker setDate={setStartDate} date={startDate} />
                                        {/* <Input {...field} type='time' value={field.value || ''} required /> */}
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
                                    <FormLabel>Shift End Time (HH:mm)</FormLabel>
                                    <FormControl>
                                        <TimePicker setDate={setEndDate} date={endDate} />
                                        {/* <Input {...field} type='time' value={field.value || ''} required /> */}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Shift Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} value={field.value || ''} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className='col-span-6'>
                        <FormField
                            control={control}
                            name='orderingDeadlineBeforeShiftStart'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ordering Deadline Before Shift Start (in hours)</FormLabel>
                                    <FormControl>
                                        <Input {...field} type='number' value={field.value || 0} required />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <div className='mt-8 flex items-center justify-end'>
                    <Button type='submit'>Create</Button>
                </div>
            </form>
        </Form>
    )
}
