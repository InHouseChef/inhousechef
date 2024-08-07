interface ErrorProps {
    message?: string
    onClick?: VoidFunction
}

export const Warning = ({ onClick, message }: ErrorProps) =>
    message ? (
        <div
            className={`flex items-center gap-2 rounded bg-[rgba(254,121,7,0.1)] p-2 cursor-${
                onClick ? 'pointer' : 'default'
            }`}
            onClick={onClick}>
            <p className='text-base font-normal leading-5'>{message}</p>
        </div>
    ) : null
