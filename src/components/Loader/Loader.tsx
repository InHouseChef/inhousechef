import { LoaderIcon } from 'lucide-react'
import './index.css'

export const Loader = () => (
    <div className='z-15 absolute inset-0 flex flex-wrap items-center justify-center gap-2 bg-white'>
        <LoaderIcon className='h-8 w-8 animate-spin' />
    </div>
)
