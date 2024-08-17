import { ReactNode } from 'react'
import CompanyLayout from './layouts/CompanyLayout'

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return <CompanyLayout>{children}</CompanyLayout>
}
