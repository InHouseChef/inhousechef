import { DynamicTheme, QueryProvider } from '@/providers'
import { RoleProvider } from '@/providers/RoleProvider/RoleProvider'
import { ReactNode } from 'react'
import './global.css'

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
                    <RoleProvider>{children}</RoleProvider>
                </DynamicTheme>
            </QueryProvider>
        </html>
    )
}
