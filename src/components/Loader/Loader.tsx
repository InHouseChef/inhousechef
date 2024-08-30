import './index.css'
import { cn } from '@/lib/utils';

interface LoaderProps {
    className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ className }) => (
    <div className={cn('z-15 absolute inset-0 flex flex-wrap items-center justify-center gap-2 bg-white', className)}>
        <div className='h-1.5 w-1.5 animate-load rounded-full bg-primary'></div>
        <div className='animate-delay-200 h-1.5 w-1.5 animate-load rounded-full bg-primary'></div>
        <div className='animate-delay-300 h-1.5 w-1.5 animate-load rounded-full bg-primary'></div>
        <div className='animate-delay-400 h-1.5 w-1.5 animate-load rounded-full bg-primary'></div>
        <div className='animate-delay-500 h-1.5 w-1.5 animate-load rounded-full bg-primary'></div>
        <div className='animate-delay-600 h-1.5 w-1.5 animate-load rounded-full bg-primary'></div>
    </div>
);