import { Address } from '@/api/common'

interface PlaceProps {
    address?: Address
}

export const Place = ({ address }: PlaceProps) => {
    if (!address) return <span className='text-gray'>N/A</span>

    const { street, city } = address

    const fullAddress = `${street}, ${city}`

    return <span>{fullAddress}</span>
}
