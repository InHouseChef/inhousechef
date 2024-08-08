import { Placeholder } from '@/packages/components'
import { ColumnDef } from '@tanstack/react-table'

interface TableBodyPlaceholderProps {
    columns: ColumnDef<any, unknown>[]
}

export const TableBodyPlaceholder = ({ columns }: TableBodyPlaceholderProps) => {
    const cols = columns.map((value, index) => (
        <td key={index}>
            <Placeholder w={60} h={14} />
        </td>
    ))
    const rows = [...Array(10).keys()].map((value, index) => <tr key={index}>{cols}</tr>)
    return <>{rows}</>
}
