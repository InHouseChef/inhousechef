export const removeAllNonInteger = (value: string) => value.replace(/\D/g, '')

export const removeAllNonDecimal = (value: string) => value.replaceAll(/[^0-9.]/g, '')
