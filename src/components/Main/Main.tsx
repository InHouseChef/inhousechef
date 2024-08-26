import { ReactNode } from 'react'

interface MainProps {
    children?: ReactNode
}

export const Main = ({ children }: MainProps) => {
    return (
        <main className='relative flex h-[calc(100dvh-var(--topnav-height))] flex-grow flex-row overflow-x-auto overflow-y-auto bg-[#F8FBFF]'>
            {children}
        </main>
    )
}
