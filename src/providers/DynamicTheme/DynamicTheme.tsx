'use client'

import { useTheme } from '@/hooks'
import localFont from 'next/font/local'
import { ReactNode, useEffect, useState } from 'react'

interface DynamicTheme {
    colors: Record<string, string>
}

interface DynamicThemeProps {
    children?: ReactNode
}

const robotoFlex = localFont({ src: '../../fonts/RobotoFlex/RobotoFlex-VariableFont.ttf', variable: '--font-roboto-flex' })

export const DynamicTheme = ({ children }: DynamicThemeProps) => {
    const { theme } = useTheme()
    const [style, setStyle] = useState('')

    const createCssColorVariables = (theme?: DynamicTheme) => {
        if (!theme) return
        return Object.entries(theme.colors)
            .map(([key, value]) => `--color-${key}: ${value};`)
            .join(' ')
    }

    useEffect(() => setStyle(`:root {${createCssColorVariables(theme)}}`), [theme])

    return (
        <>
            <style jsx>{`
                ${style}
            `}</style>
            <body className={`${robotoFlex.variable} font-roboto-flex flex min-h-dvh w-full overflow-hidden`}>
                {children}
            </body>
        </>
    )
}
