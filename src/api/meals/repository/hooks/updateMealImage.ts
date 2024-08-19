import { MutationParams } from "@/types"
import { UpdateMealImageRequest, UpdateMealResponse } from "../../contract"
import { axiosPrivate } from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"
import { queryClient } from "@/lib/react-query"
import { MEAL_KEYS } from "../keys"

interface UpdateMealImagePath {
    mealId: string
}
interface UpdateMealParams extends MutationParams<UpdateMealImagePath, UpdateMealImageRequest> {}

export const updateMealImage = ({ path: { mealId }, body }: UpdateMealParams): Promise<UpdateMealResponse> =>
    axiosPrivate.patch(`/meals/${mealId}/image`, body, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })

export const useUpdateMealImage = () =>
    useMutation({
        mutationFn: updateMealImage,
        onSuccess: () =>
            queryClient.invalidateQueries({
                queryKey: MEAL_KEYS.base
            })
    })