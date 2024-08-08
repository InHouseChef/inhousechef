export interface PlaceholderProps {
    w?: number | string
    h?: number | string
    r?: number | string
}

export const Placeholder = ({ w = '100%', h = 40, r = 4 }: PlaceholderProps) => {
    const wValue = w ? (typeof w === 'number' ? `${w}px` : w) : ''
    const hValue = h ? (typeof h === 'number' ? `${h}px` : h) : ''
    const rValue = r ? (typeof r === 'number' ? `${r}px` : r) : ''

    return (
        <div
            className='animate-pulse bg-grey500'
            style={{
                width: wValue,
                height: hValue,
                borderRadius: rValue
            }}
        />
    )
}

Placeholder.displayName = 'Placeholder'
