import { DynamicTheme, QueryProvider } from '@/providers'
import { ReactNode } from 'react'
import './global.css'
import { MainLayout } from './layouts/MainLayout/MainLayout'
import { RoleProvider } from '@/providers/RoleProvider/RoleProvider'

export const metadata = {
    robots: {
        index: false,
        follow: false
    }
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang='en'>
            <QueryProvider>
                <DynamicTheme>
                    <RoleProvider>
                        <MainLayout>{children}</MainLayout>
                    </RoleProvider>
                </DynamicTheme>
            </QueryProvider>
        </html>
    )
}
