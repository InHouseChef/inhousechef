interface GetFullNameProps {
    firstName?: string
    lastName?: string
}

export const getInitialChars = (chars: string, limit?: number) => {
    const letters = chars
        .split(' ')
        .map(word => word[0])
        .join('')

    return limit ? letters.slice(0, 2) : letters
}

export const getInitials = (chars: string) => (chars.indexOf(' ') === -1 ? chars.substring(0, 2) : getInitialChars(chars, 2))

export const getFullName = ({ firstName, lastName }: GetFullNameProps) => {
    if (!firstName && !lastName) return ''
    if (!firstName) return `${lastName}`
    if (!lastName) return `${firstName}`
    return `${firstName} ${lastName}`
}
