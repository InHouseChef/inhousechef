'use client'
import { ReactNode } from 'react'

export interface HeaderProps {
    heading: string | ReactNode
    children?: ReactNode
}

export const Header = ({ heading, children }: HeaderProps) => {
    return (
        <header className='my-5 flex flex-wrap items-center justify-between gap-5'>
            <div>
                {typeof heading === 'string' ? (
                    <div>
                        <h1 className='text-2xl text-white md:text-3xl md:leading-10'>{heading}</h1>
                    </div>
                ) : (
                    heading
                )}
            </div>
            <div className='ml-auto flex items-center gap-4'>{children}</div>
        </header>
    )
}
