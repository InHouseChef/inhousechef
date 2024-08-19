import { ReactNode } from 'react'

interface MainProps {
    children?: ReactNode
}

export const Main = ({ children }: MainProps) => {
    return (
        <main className='relative flex h-[calc(100dvh-var(--topnav-height))] flex-grow flex-col overflow-y-auto overflow-x-hidden bg-[#fafaff] pb-5 md:p-6 md:pt-0 lg:px-5'>
            <div id='main-portal' className='z-200 sticky top-0 -mx-6' />
            {children}
        </main>
    )
}
