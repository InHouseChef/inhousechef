'use client'

import { TopNav } from "@/components"
import { ClientProtectedLayout } from "../layouts/ProtectedLayout"
import { ReactNode } from "react"

interface ProtectedLayoutProps {
    children?: ReactNode
}

export default function Layout({ children }: ProtectedLayoutProps) {
    return (
        <ClientProtectedLayout>
            <div className='flex flex-col flex-grow overflow-x-clip'>
                <TopNav />
                {children}
            </div>
        </ClientProtectedLayout>
    )
}
