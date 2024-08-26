import { z } from "zod";

export const createALaCardShiftSchema = z.object({
    shiftStartAt: z.string(),
    shiftEndAt: z.string(),
})