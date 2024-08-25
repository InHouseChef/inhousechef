import { z } from "zod";

export const createShiftSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    shiftStartAt: z.string(),
    shiftEndAt: z.string(),
    orderingDeadlineBeforeShiftStart: z.preprocess((val) => Number(val), z.number().min(0, 'Deadline must be a positive number.')),
})

export const updateShiftSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    shiftStartAt: z.string(),
    shiftEndAt: z.string(),
    orderingDeadlineBeforeShiftStart: z.preprocess((val) => Number(val), z.number().min(0, 'Deadline must be a positive number.')),
})