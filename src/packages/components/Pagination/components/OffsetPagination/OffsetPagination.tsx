import { OffsetPaginationRequest } from '@/packages/types'
import clsx from 'clsx'
import { generatePageNumbers } from '../../utils'

interface OffsetPaginationProps {
    totalCount?: number
    pagination?: OffsetPaginationRequest
    onPaginationChange?: (value: OffsetPaginationRequest) => void
    showBoundaryPages?: boolean
    visiblePages?: number
}

export const OffsetPagination = ({
    totalCount,
    pagination,
    showBoundaryPages = true,
    visiblePages = 5,
    onPaginationChange
}: OffsetPaginationProps) => {
    if (!pagination || !totalCount) return <></>
    const { page, size } = pagination
    const index = page + 1
    const disabledPrev = page <= 0
    const disabledNext = size * index >= totalCount
    const handlePrev = () => onPaginationChange && onPaginationChange({ size, page: page - 1 })
    const handleNext = () => onPaginationChange && onPaginationChange({ size, page: page + 1 })

    const pageNumbers = generatePageNumbers({ page: page + 1, totalCount, size, showBoundaryPages, visiblePages })

    const handleSetPage = (pageNumber: number | string) => {
        if (!onPaginationChange || typeof pageNumber !== 'number') return

        onPaginationChange({ size, page: pageNumber - 1 })
    }

    return (
        <div className='flex items-center gap-2'>
            {!disabledPrev ? (
                <button
                    className='group grid place-items-center border-0 bg-transparent p-0 outline-none'
                    type='button'
                    onClick={handlePrev}
                    disabled={disabledPrev}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                        className='text-grey disabled:text-grey/[.50] group-disabled:text-grey/50 h-4 w-4 transition-colors duration-200 group-hover:text-primary'>
                        <path d='M10 12L6 8L10 4' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' />
                    </svg>
                </button>
            ) : undefined}
            <div className='flex flex-wrap items-center gap-1'>
                {pageNumbers.map((pageNumber, index) => (
                    <button
                        className={clsx(
                            'text-grey grid h-8 min-w-8 place-items-center rounded-lg border border-white px-1 outline-none transition-colors hover:border-primary hover:text-primary',
                            {
                                'pointer-events-none border-primary bg-primary text-white hover:text-white':
                                    pageNumber === page + 1,
                                'pointer-events-none': pageNumber === '...'
                            }
                        )}
                        type='button'
                        disabled={pageNumber === '...'}
                        key={`${page}${index}`}
                        onClick={() => handleSetPage(pageNumber)}>
                        {pageNumber}
                    </button>
                ))}
            </div>
            {!disabledNext ? (
                <button
                    className='group grid place-items-center border-0 bg-transparent p-0 outline-none'
                    type='button'
                    onClick={handleNext}
                    disabled={disabledNext}>
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        viewBox='0 0 16 16'
                        fill='none'
                        className='text-grey group-disabled:text-grey/50 h-4 w-4 transition-colors duration-200 group-hover:text-primary'>
                        <path d='M6 4L10 8L6 12' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' />
                    </svg>
                </button>
            ) : undefined}
        </div>
    )
}
