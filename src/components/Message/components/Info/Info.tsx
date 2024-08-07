import { ReactNode } from 'react'

interface InfoProps {
    children?: ReactNode
}

export const Info = ({ children }: InfoProps) =>
    children ? <div className='rounded bg-[#fcedea] p-2'>{children}</div> : null
