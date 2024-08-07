export const decimalToPercentage = (decimal: number) => decimal * 100

export function formatNumber(
    number?: number,
    options: Intl.NumberFormatOptions = {},
    locales: string | string[] = 'en-US'
): string {
    if (number === undefined) return ''

    const numberFormatOptions: Intl.NumberFormatOptions = {
        style: options.style || 'currency',
        currency: options.currency || 'USD',
        maximumFractionDigits: options.maximumFractionDigits || 2,
        minimumFractionDigits: options.minimumFractionDigits || 2,
        ...options
    }

    if (numberFormatOptions.style === 'percent') number /= 100

    const numberFormat = new Intl.NumberFormat(locales, numberFormatOptions)
    const numberInParts = numberFormat.formatToParts(number)

    const valueArray = numberInParts.map(({ type, value }) =>
        type === 'currency' || type === 'percentSign' ? ` ${value} ` : value
    )

    return valueArray.join('')
}
