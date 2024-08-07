interface ErrorProps {
    error?: unknown
    message?: string
}

export const Error = ({ error, message }: ErrorProps) => {
    const exception = error as Exception

    return exception || message ? (
        <div className='border-red400 bg-red/10 flex items-center gap-2 rounded border p-3'>
            <p className='text-sm font-normal leading-5'>{exception ? exception.title : message}</p>
        </div>
    ) : null
}
