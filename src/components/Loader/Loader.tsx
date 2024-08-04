import './index.css'

export const Loader = () => (
    <div className='absolute inset-0 z-15 flex flex-wrap items-center justify-center gap-2 bg-white'>
        <div className='h-1.5 w-1.5 animate-load rounded-full bg-primary'></div>
        <div className='animate-delay-200 h-1.5 w-1.5 animate-load rounded-full bg-primary'></div>
        <div className='animate-delay-300 h-1.5 w-1.5 animate-load rounded-full bg-primary'></div>
        <div className='animate-delay-400 h-1.5 w-1.5 animate-load rounded-full bg-primary'></div>
        <div className='animate-delay-500 h-1.5 w-1.5 animate-load rounded-full bg-primary'></div>
        <div className='animate-delay-600 h-1.5 w-1.5 animate-load rounded-full bg-primary'></div>
    </div>
)
