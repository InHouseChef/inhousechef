'use client'

import { Loader } from '@/components'
import { NotificationPopper } from '@/components/NotificationPopper/NotificationPopper'
import { useBaseUrl, useSettings, useTheme } from '@/hooks'
import localFont from 'next/font/local'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'

interface DynamicTheme {
    colors: Record<string, string>
}

interface DynamicThemeProps {
    children?: ReactNode
}

const satoshi = localFont({ src: '../../fonts/Satoshi/Satoshi-Variable.ttf', variable: '--font-satoshi' })

export const DynamicTheme = ({ children }: DynamicThemeProps) => {
    const { theme } = useTheme()
    const [style, setStyle] = useState('')
    const { baseUrl } = useBaseUrl()
    const { push } = useRouter()

    const { isError, isLoading } = useSettings()

    useEffect(() => {
        if (!isError) return
        push(baseUrl)
    }, [isError])

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
            <body className={`${satoshi.variable} flex min-h-dvh w-full overflow-hidden font-satoshi`}>
                {isLoading ? <Loader /> : children}
            </body>
            <NotificationPopper />
        </>
    )
}
