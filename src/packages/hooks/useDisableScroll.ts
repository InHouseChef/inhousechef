'use client'
import { useEffect } from 'react'

export const useDisableScroll = (isDisabled: boolean, config?: { selector?: string }) => {
    useEffect(() => {
        const element = document.querySelector<HTMLElement>(config?.selector || 'main')

        const disableScroll = () => (element ? (element.style.overflowY = 'hidden') : undefined)

        const enableScroll = () => (element ? (element.style.overflowY = 'auto') : undefined)

        isDisabled ? disableScroll() : enableScroll()

        return () => {
            enableScroll()
        }
    }, [isDisabled])
}
