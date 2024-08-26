import { ChevronLeft, ChevronRight } from '@/packages/icons'
import { Spinner } from '../Spinner'

interface PaginationProps {
    page: number
    onPrev: VoidFunction
    onNext: VoidFunction
    disabledPrev?: boolean
    disabledNext?: boolean
    isFetching?: boolean
}

export const Pagination = ({ page, onPrev, onNext, disabledPrev, disabledNext, isFetching }: PaginationProps) => {
    const buttonClassNames = 'group grid place-items-center border-0 bg-transparent p-0 text-grey outline-none'
    const iconClassNames = 'h-4 w-4 text-grey transition-colors  group-hover:text-primary group-disabled:text-grey/50'

    return (
        <div className='text-grey flex items-center'>
            <button type='button' className={buttonClassNames} onClick={onPrev} disabled={disabledPrev || isFetching}>
                <ChevronLeft className={iconClassNames} />
            </button>
            <span className='flex w-6 items-center justify-center text-center'>{isFetching ? <Spinner /> : page}</span>
            <button type='button' className={buttonClassNames} onClick={onNext} disabled={disabledNext || isFetching}>
                <ChevronRight className={iconClassNames} />
            </button>
        </div>
    )
}
