import { Metadata } from 'next'
import { ReactNode } from 'react'

interface ProtectedLayoutProps {
    children?: ReactNode
}

export async function generateMetadata(): Promise<Metadata> {
    const title = 'Kristal Kettering'
    const description = 'Kristal Kettering'

    return {
        title,
        description,
        icons: {
            icon: [
                {
                    url: '/images/favicon-light.svg',
                    media: '(prefers-color-scheme: light)',
                    rel: 'icon',
                    type: 'image/x-icon'
                },
                {
                    url: '/images/favicon-dark.svg',
                    media: '(prefers-color-scheme: dark)',
                    rel: 'icon',
                    type: 'image/x-icon'
                }
            ]
        }
    }
}

export default function Layout({ children }: ProtectedLayoutProps) {
    return <>{children}</>
}
