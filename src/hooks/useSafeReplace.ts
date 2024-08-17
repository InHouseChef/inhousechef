'use client'
import { useRouter } from 'next/navigation'

export const useSafeReplace = () => {
    const { replace } = useRouter()
    const safeReplace = (path: string) => {
        setTimeout(() => {
            replace(path)
        }, 0)
    }

    return { safeReplace }
}
