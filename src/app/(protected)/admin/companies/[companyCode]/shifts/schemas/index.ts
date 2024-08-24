import { z } from "zod";

export const createShiftSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    shiftStartAt: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format. Please use HH:mm.'),
    shiftEndAt: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format. Please use HH:mm.'),
    orderingDeadlineBeforeShiftStart: z.preprocess((val) => Number(val), z.number().min(0, 'Deadline must be a positive number.')),
})

export const updateShiftSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    shiftStartAt: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format. Please use HH:mm.'),
    shiftEndAt: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format. Please use HH:mm.'),
    orderingDeadlineBeforeShiftStart: z.preprocess((val) => Number(val), z.number().min(0, 'Deadline must be a positive number.')),
})