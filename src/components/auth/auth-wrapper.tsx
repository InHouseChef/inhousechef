interface AuthHeaderProps {
    label: string
    title: string
}

const AuthHeader = ({ label, title }: AuthHeaderProps) => {
    return (
        <div className='flex w-full flex-col items-center justify-center gap-y-4'>
            <h1 className='text-3xl font-semibold'>{title}</h1>
            <p className='text-sm text-muted-foreground'>{label}</p>
        </div>
    )
}

export default AuthHeader
