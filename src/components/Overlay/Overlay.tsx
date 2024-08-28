// components/Overlay/Overlay.tsx

interface OverlayProps {
    message: string
}

export const Overlay = ({ message }: OverlayProps) => {
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-75'>
            <div className='rounded-lg bg-white p-6 text-center shadow-lg'>
                <h2 className='mb-4 text-lg font-semibold'>{message}</h2>
            </div>
        </div>
    )
}
