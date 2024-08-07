import { removeAllNonDecimal, removeAllNonInteger } from '@/packages/utils'

export const formatNumberValue = (value: string, fractionDigits?: number) => {
    const hasFractionDigits = !!fractionDigits
    const onlyNumbersAndDots = hasFractionDigits ? removeAllNonDecimal(value) : removeAllNonInteger(value)
    const arrayFromString = onlyNumbersAndDots.split('.').slice(0, 2)
    const fraction = arrayFromString[1]
    if (hasFractionDigits && fraction) {
        arrayFromString[1] = fraction.slice(0, fractionDigits)
    }
    return arrayFromString.shift() + (arrayFromString.length ? '.' + arrayFromString.join('') : '')
}
