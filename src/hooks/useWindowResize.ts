'use client'

import { useLayoutEffect } from 'react'

export const useWindowResize = (callback: VoidFunction) => {
    useLayoutEffect(() => {
        callback()
        window.addEventListener('resize', callback)
        return () => {
            window.removeEventListener('resize', callback)
        }
    }, [])
}
