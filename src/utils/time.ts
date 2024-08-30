// utils/time.ts
export interface Time {
    hours: number
    minutes: number
    seconds: number
}

export const createTime = (hours: number = 0, minutes: number = 0, seconds: number = 0): Time => {
    if (hours < 0 || hours > 23) {
        throw new Error('Invalid hours value')
    }
    if (minutes < 0 || minutes > 59) {
        throw new Error('Invalid minutes value')
    }
    if (seconds < 0 || seconds > 59) {
        throw new Error('Invalid seconds value')
    }
    return { hours, minutes, seconds }
}

export const timeToString = (time: Time): string => {
    const hoursString = ('0' + time.hours.toString()).slice(-2)
    const minutesString = ('0' + time.minutes.toString()).slice(-2)
    const secondsString = ('0' + time.seconds.toString()).slice(-2)
    return `${hoursString}:${minutesString}:${secondsString}`
}

export const timeFromString = (timeString: string): Time => {
    const timeArray = timeString.split(':')
    if (timeArray.length !== 3) {
        throw new Error('Invalid time string format')
    }
    const hours = parseInt(timeArray[0])
    const minutes = parseInt(timeArray[1])
    const seconds = parseInt(timeArray[2])
    return createTime(hours, minutes, seconds)
}

export const subtractTime = (time1: Time, time2: Time): Time => {
    let seconds = time1.seconds - time2.seconds
    let minutes = time1.minutes - time2.minutes
    let hours = time1.hours - time2.hours
    if (seconds < 0) {
        seconds += 60
        minutes--
    }
    if (minutes < 0) {
        minutes += 60
        hours--
    }
    if (hours < 0) {
        hours += 24
    }
    return createTime(hours, minutes, seconds)
}

export const timeToDate = (time: Time, date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), time.hours, time.minutes, time.seconds)
}

export const timeToMilliseconds = (time: Time): number => {
    return (time.hours * 3600 + time.minutes * 60 + time.seconds) * 1000
}
