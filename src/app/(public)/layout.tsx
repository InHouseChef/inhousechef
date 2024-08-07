import { ReactNode } from 'react'
import { PublicLayout } from './layouts/PublicLayout'

interface PublicLayoutProps {
    children?: ReactNode
}

export default function Layout({ children }: PublicLayoutProps) {
    return <PublicLayout>{children}</PublicLayout>
}
