import { useId } from 'react'

export const useUid = (id?: string) => {
    const uid = useId()
    return id || uid
}
