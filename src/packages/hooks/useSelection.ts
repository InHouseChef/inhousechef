import { useEffect, useState } from 'react'

interface SelectionData {
    id: string
}

export const useSelection = <T extends SelectionData>(
    data: T[],
    selectedRows?: string[],
    onRowSelect?: (value: string[]) => void
) => {
    const [selectedRowsState, setSelectedRowsState] = useState<Map<string, boolean>>(new Map<string, boolean>())
    const [isPageSelected, setIsPageSelected] = useState<boolean>(false)

    useEffect(() => {
        if (!onRowSelect || !data.length) return
        checkIsAllSelected()
    }, [data])

    useEffect(() => {
        if (!selectedRows || !selectedRows?.length || selectedRowsState.size) return
        const rowsSelected = new Map(selectedRowsState)
        selectedRows.forEach(id => rowsSelected.set(id, true))
        checkIsAllSelected(rowsSelected)
        setSelectedRowsState(rowsSelected)
    }, [selectedRows])

    useEffect(() => {
        if (!onRowSelect) return
        onRowSelect(Array.from(selectedRowsState.keys()))
    }, [selectedRowsState.size])

    const selectAll = () => {
        const rowsSelected = new Map(selectedRowsState)
        data.forEach(({ id }) => {
            rowsSelected.set(id, true)
        })
        setSelectedRowsState(rowsSelected)
        setIsPageSelected(true)
    }

    const unselectAll = () => {
        const rowsSelected = new Map(selectedRowsState)
        data.forEach(({ id }) => {
            rowsSelected.delete(id)
        })
        setSelectedRowsState(rowsSelected)
        setIsPageSelected(false)
    }

    const checkIsAllSelected = (rowsSelected?: Map<string, boolean>) => {
        const selectionState = rowsSelected || selectedRowsState
        setIsPageSelected(data.every(({ id }: T) => selectionState.get(id)))
    }

    const isSelected = ({ id }: T) => selectedRowsState.get(id)

    const select = ({ id }: T) => {
        const rowsSelected = new Map(selectedRowsState)
        rowsSelected.set(id, true)
        setSelectedRowsState(rowsSelected)
        checkIsAllSelected(rowsSelected)
    }

    const unselect = ({ id }: T) => {
        const rowSelected = new Map(selectedRowsState)
        rowSelected.delete(id)
        setSelectedRowsState(rowSelected)
        if (isPageSelected) setIsPageSelected(false)
    }

    const toggleAll = (shouldSelect: boolean) => (shouldSelect ? selectAll() : unselectAll())

    const toggleRow = (data: T) => (isSelected(data) ? unselect(data) : select(data))

    return {
        isPageSelected,
        toggleAll,
        isSelected,
        toggleRow
    }
}
