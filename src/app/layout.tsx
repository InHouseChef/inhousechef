import { DynamicTheme, QueryProvider } from '@/providers'
import { RoleProvider } from '@/providers/RoleProvider/RoleProvider'
import { Metadata } from 'next'
import { ReactNode } from 'react'
import './global.css'
import { MainLayout } from './layouts/MainLayout/MainLayout'

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
        },
        applicationName: 'Kristal Kettering'
    }
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang='en'>
            <QueryProvider>
                <RoleProvider>
                    <DynamicTheme>
                    <MainLayout>{children}</MainLayout>
                    </DynamicTheme>
                </RoleProvider>
            </QueryProvider>
        </html>
    )
}
