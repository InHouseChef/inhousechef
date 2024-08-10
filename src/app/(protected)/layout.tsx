import { ReactNode } from 'react'
import { ProtectedLayout } from './layouts/ProtectedLayout'

interface ProtectedLayoutProps {
    children?: ReactNode
}

export default function Layout({ children }: ProtectedLayoutProps) {
    return <ProtectedLayout>{children}</ProtectedLayout>
}
