import { EventButton } from '@/packages/components'
import { X } from '@/packages/icons'
import { SortingState } from '@tanstack/react-table'

interface TableClearSortProps {
    onReset: (defaultState?: boolean) => void
    sorting?: SortingState
}

export const TableClearSort = ({ sorting, onReset }: TableClearSortProps) => (
    <div className='relative ml-auto'>
        {sorting?.length ? (
            <EventButton
                onClick={() => onReset()}
                className='absolute right-0 top-1/2 flex h-4 w-4 max-w-0 -translate-y-1/2 transform items-center justify-center rounded-sm bg-grey transition-colors duration-200 hover:bg-primary'>
                <X className='h-2.5 min-h-0 w-2.5 min-w-0 text-white hover:text-white' />
            </EventButton>
        ) : undefined}
    </div>
)
