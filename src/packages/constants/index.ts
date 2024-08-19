import { DateFormatOptions, DateFormatProps, TimeFormatOptions, TimePartType } from '../types'

export const DEFAULT_DATE_FORMAT_OPTIONS: DateFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
}
export const DEFAULT_DATE_PROPS: DateFormatProps = {
    options: DEFAULT_DATE_FORMAT_OPTIONS,
    format: ['month', 'day', 'year'],
    separator: '/'
}

export const DEFAULT_TIME_FORMAT_OPTIONS: TimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric'
}

export const TIME_FORMAT: TimePartType[] = ['hour', 'minute']
