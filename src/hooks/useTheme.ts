'use client'
import { CompanyPath } from '@/types'
import { useEffect } from 'react'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { usePathParams } from './useDefaultQueryParams'
import { settingsStore } from './useSettings'

interface DynamicTheme {
    colors: Record<string, string>
}

interface UseThemeStore {
    theme?: DynamicTheme
    setTheme: (theme: DynamicTheme) => void
}

const DEFAULT_COLOR = 'rgba(124,58,237,1)';

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

const hexToRgba = (hex: string) => {
    let hexCode = hex.replace('#', '');
    if (hexCode.length === 3) {
        hexCode = `${hexCode[0]}${hexCode[0]}${hexCode[1]}${hexCode[1]}${hexCode[2]}${hexCode[2]}`;
    } else if (hexCode.length === 4) {
        hexCode = `${hexCode[0]}${hexCode[0]}${hexCode[1]}${hexCode[1]}${hexCode[2]}${hexCode[2]}${hexCode[3]}${hexCode[3]}`;
    }

    const r = parseInt(hexCode.substring(0, 2), 16);
    const g = parseInt(hexCode.substring(2, 4), 16);
    const b = parseInt(hexCode.substring(4, 6), 16);

    // Handle the optional alpha value
    let a = 1; // Default opacity is 1 (fully opaque)
    if (hexCode.length === 8) {
        a = parseInt(hexCode.substring(6, 8), 16) / 255; // Convert alpha from hex to decimal (0-1 range)
    }

    return `rgba(${r},${g},${b},${a})`;
};


export const useTheme = () => {
    const { companyCode } = usePathParams<CompanyPath>()
    const { theme, setTheme } = themeStore()

    const { branding } = settingsStore()

    useEffect(() => {
        const primaryColor = branding?.primaryColor
        const secondaryColor = branding?.secondaryColor
        setTheme({ 
            colors: { 
                primary: primaryColor ? hexToRgba(primaryColor) : DEFAULT_COLOR, 
                secondary: secondaryColor ? hexToRgba(secondaryColor) : DEFAULT_COLOR 
            } 
        })
    }, [branding])

    useEffect(() => {
        if (companyCode) return
        setTheme({ colors: { primary: DEFAULT_COLOR, secondary: DEFAULT_COLOR } })
    }, [companyCode])

    return {
        theme
    }
}
