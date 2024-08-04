'use client'
import { useEffect } from 'react'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface DynamicTheme {
    colors: Record<string, string>
}

interface UseThemeStore {
    theme?: DynamicTheme
    setTheme: (theme: DynamicTheme) => void
}

const DEFAULT_COLOR = '44, 85, 251'

export const themeStore = create<UseThemeStore>()(
    devtools(
        persist(
            set => ({
                theme: undefined,
                setTheme: theme => set({ theme })
            }),

            {
                name: 'theme'
            }
        )
    )
)

const hexToRgb = (hex: string) => {
    let hexCode = hex.replace('#', '')
    if (hexCode.length === 3) hexCode = `${hexCode[0]}${hexCode[0]}${hexCode[1]}${hexCode[1]}${hexCode[2]}${hexCode[2]}`
    const r = parseInt(hexCode.substring(0, 2), 16)
    const g = parseInt(hexCode.substring(2, 4), 16)
    const b = parseInt(hexCode.substring(4, 6), 16)
    return `${r},${g},${b}`
}

export const useTheme = () => {
    const { theme, setTheme } = themeStore()

    useEffect(() => {
        setTheme({ colors: { primary: DEFAULT_COLOR } })
    }, [])

    return {
        theme
    }
}
