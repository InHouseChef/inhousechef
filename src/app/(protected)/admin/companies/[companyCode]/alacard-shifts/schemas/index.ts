import { z } from "zod";

export const createALaCardShiftSchema = z.object({
    shiftStartAt: z.date(),
    shiftEndAt: z.date(),
})