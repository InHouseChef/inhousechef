import { TopNav } from '@/components'
import { getCompanyMetadataIcons } from '@/utils/metadata'
import { Metadata } from 'next'
import { ReactNode } from 'react'
import { ClientProtectedLayout } from '../layouts/ProtectedLayout'

interface ProtectedLayoutProps {
    children?: ReactNode
}

export async function generateMetadata(): Promise<Metadata> {
    const icons = await getCompanyMetadataIcons()

    const title = 'Kristal Kettering'
    const description = 'Kristal Kettering'

    return {
        title,
        description,
        icons
    }
}

export default function Layout({ children }: ProtectedLayoutProps) {
    return (
        <ClientProtectedLayout>
            <div className='flex flex-grow flex-col overflow-x-clip'>
                <TopNav />
                {children}
            </div>
        </ClientProtectedLayout>
    )
}
