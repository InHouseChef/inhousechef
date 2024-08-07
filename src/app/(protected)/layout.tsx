import { ReactNode } from 'react'
import { ProtectedLayout } from './layouts/ProtectedLayout'

interface FacilityLayoutProps {
    children?: ReactNode
}

export default function Layout({ children }: FacilityLayoutProps) {
    return <ProtectedLayout>{children}</ProtectedLayout>
}
