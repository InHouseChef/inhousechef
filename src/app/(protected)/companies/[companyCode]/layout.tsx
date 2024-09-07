'use client'

import { getCompanyMetadataIcons } from '@/utils/metadata'
import { Metadata } from 'next'
import { ReactNode } from 'react'

interface LayoutProps {
    children: ReactNode
}

// export async function generateMetadata(): Promise<Metadata> {
//     const icons = await getCompanyMetadataIcons()

//     const title = 'Kristal Kettering '
//     const description = 'Kristal Kettering'

//     return {
//         title,
//         description,
//         icons
//     }
// }

export default function Layout({ children }: LayoutProps) {
    return <>{children}</>
}
