interface GeneratePageNumbersProps {
    page: number
    totalCount: number
    size: number
    visiblePages: number
    showBoundaryPages: boolean
}

export const generatePageNumbers = ({ page, size, totalCount, visiblePages, showBoundaryPages }: GeneratePageNumbersProps) => {
    const totalPages = Math.ceil(totalCount / size)
    const halfVisiblePages = Math.floor(visiblePages / 2)

    let startPage = Math.max(page - halfVisiblePages, 1)
    const endPage = Math.min(startPage + visiblePages - 1, totalPages)

    if (endPage - startPage + 1 < visiblePages) {
        startPage = Math.max(endPage - visiblePages + 1, 1)
    }

    const pageNumbers: (number | string)[] = []

    if (startPage > 1 && showBoundaryPages) {
        pageNumbers.push(1)
        if (startPage > 2) {
            pageNumbers.push('...')
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
    }

    if (endPage < totalPages && showBoundaryPages) {
        if (endPage < totalPages - 1) {
            pageNumbers.push('...')
        }
        pageNumbers.push(totalPages)
    }

    return pageNumbers
}
