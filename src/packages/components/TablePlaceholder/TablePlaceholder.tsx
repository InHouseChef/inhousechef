import { Placeholder } from '@/packages/components'

export interface TablePlaceholderProps {
    rows?: number
    hasPagination?: boolean
}

export const TablePlaceholder = ({ rows = 15, hasPagination = true }: TablePlaceholderProps) => (
    <>
        <Placeholder h={rows * 40 + 42} />
        <div className='mt-4 flex justify-between'>
            {hasPagination ? (
                <>
                    <div className='flex flex-col gap-2.5 md:flex-row md:items-center md:gap-5 lg:gap-10'>
                        <Placeholder w={60} h={32} />
                    </div>
                    <div className='flex items-center gap-1'>
                        <Placeholder w={32} h={32} />
                        <Placeholder w={32} h={32} />
                        <Placeholder w={32} h={32} />
                        <Placeholder w={32} h={32} />
                    </div>
                </>
            ) : undefined}
        </div>
    </>
)
