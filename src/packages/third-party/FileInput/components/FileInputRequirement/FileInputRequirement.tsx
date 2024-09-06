import { FileTypes } from '@/types'
import { formatBytes } from '../../utils/file'

interface FileInputAcceptProps {
    accept?: FileTypes[]
    maxSize?: number
    description?: string
}

export const FileInputRequirement = ({ accept, maxSize, description }: FileInputAcceptProps) => (
    <div className='flex flex-col gap-0.5'>
        {accept ? (
            <p className='text-gray'>
                {description} We support {accept.join(', ')}
            </p>
        ) : undefined}
        {maxSize && <p className='text-gray500'>Max file size {formatBytes(maxSize)}</p>}
    </div>
)
