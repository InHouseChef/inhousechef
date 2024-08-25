import { DynamicTheme, QueryProvider } from '@/providers'
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
                    {children}
                </DynamicTheme>
            </QueryProvider>
        </html>
    )
}
