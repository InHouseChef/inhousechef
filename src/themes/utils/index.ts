export const hexToRgba = (hex: string, alpha = 1) => {
    let hexCode = hex.replace('#', '')
    if (hexCode.length === 3) hexCode = `${hexCode[0]}${hexCode[0]}${hexCode[1]}${hexCode[1]}${hexCode[2]}${hexCode[2]}`
    const r = parseInt(hexCode.substring(0, 2), 16)
    const g = parseInt(hexCode.substring(2, 4), 16)
    const b = parseInt(hexCode.substring(4, 6), 16)
    if (alpha > 1 && alpha <= 100) alpha = alpha / 100
    return `rgba(${r},${g},${b},${alpha})`
}
